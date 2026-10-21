package com.nirma.portal.portal_backend.service;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Optional;

@Service
public class ScholarScraperService {

    private static final String UA =
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 "
          + "(KHTML, like Gecko) Chrome/124.0 Safari/537.36";

    /** Removes "Dr.", "Prof.", and "(AT)"-style suffixes from names stored in the DB. */
    static String cleanName(String name) {
        return name
                .replaceAll("\\(.*?\\)", " ")
                .replaceAll("(?i)\\b(dr|prof)\\b\\.?", " ")
                .replaceAll("\\s+", " ")
                .trim();
    }

    /**
     * Searches Scholar by name and returns the id of the first profile whose
     * verified email domain contains "nirma". Empty if none.
     */
    public Optional<String> findVerifiedNirmaId(String facultyName) throws IOException {
        String url = "https://scholar.google.com/citations?view_op=search_authors&hl=en&mauthors="
                + URLEncoder.encode(cleanName(facultyName) + " Nirma University", StandardCharsets.UTF_8);

        Document doc = Jsoup.connect(url).userAgent(UA).timeout(10_000).get();

        for (Element r : doc.select("div.gsc_1usr")) {
            String email = r.select(".gs_ai_eml").text().toLowerCase();
            if (email.contains("nirma")) {
                String href = r.select(".gs_ai_name a").attr("href");
                String id = href.replaceAll(".*user=([^&]+).*", "$1");
                if (!id.isBlank() && !id.equals(href)) {
                    return Optional.of(id);
                }
            }
        }
        return Optional.empty();
    }

    /** Returns {citations, hIndex, i10Index} from the "All" column. */
    public int[] fetchMetrics(String scholarId) throws IOException {
        Document doc = Jsoup.connect("https://scholar.google.com/citations?hl=en&user=" + scholarId)
                .userAgent(UA)
                .timeout(10_000)
                .get();

        Elements rows = doc.select("#gsc_rsb_st tbody tr");
        if (rows.size() < 3) {
            throw new IOException("Stats table not found (blocked, CAPTCHA, or private profile)");
        }
        return new int[] {
                readAll(rows.get(0)),   // citations
                readAll(rows.get(1)),   // h-index
                readAll(rows.get(2))    // i10-index
        };
    }

    private int readAll(Element row) {
        Element cell = row.select("td.gsc_rsb_std").first();
        if (cell == null) throw new IllegalStateException("Missing stats cell");
        return Integer.parseInt(cell.text().replace(",", "").trim());
    }
}