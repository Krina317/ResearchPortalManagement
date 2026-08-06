package com.nirma.portal.portal_backend.specification;

import java.util.List;

import org.springframework.data.jpa.domain.Specification;

import com.nirma.portal.portal_backend.entity.AuthorRecord;
import com.nirma.portal.portal_backend.entity.PublicationType;

public class AuthorRecordSpecifications {

    public static Specification<AuthorRecord> build(PublicationType pubType, String nameFragment, List<Integer> positions) {
        Specification<AuthorRecord> spec = (root, q, cb) -> cb.equal(root.get("publicationType"), pubType);

        if (nameFragment != null && !nameFragment.isBlank()) {
            String pattern = "%" + nameFragment.trim().toUpperCase() + "%";
            spec = spec.and((root, q, cb) -> cb.like(root.get("normalizedName"), pattern));
        }
        if (positions != null && !positions.isEmpty()) {
            spec = spec.and((root, q, cb) -> root.get("authorPosition").in(positions));
        }
        return spec;
    }
}