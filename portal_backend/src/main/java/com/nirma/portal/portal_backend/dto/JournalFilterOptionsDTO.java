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
public class JournalFilterOptionsDTO {
    private List<String> journalTypes;
    private List<String> institutes;
    private List<String> departments;
    private List<String> indexIn;
}