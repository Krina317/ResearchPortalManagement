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
public class ConferenceFilterOptionsDTO {
    private List<String> conferenceTypes;
    private List<String> institutes;
    private List<String> departments;
    // getters/setters/constructors via lombok, same as before
}
