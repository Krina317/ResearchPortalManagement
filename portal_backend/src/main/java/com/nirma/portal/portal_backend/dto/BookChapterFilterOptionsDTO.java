package com.nirma.portal.portal_backend.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BookChapterFilterOptionsDTO {

    private List<String> publicationTypes;

    private List<String> publicationCities;

    private List<String> yearOfPublications;

    private List<String> institutes;

    private List<String> departments;
}

