package com.nirma.portal.portal_backend.DTO;

import java.time.LocalDate;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class ConferencePaperRequestDTO {
	 @NotNull(message = "ID is required")
	    private Long id;

    @NotBlank(message = "Conference name is required")
    private String conferenceName;

    @NotBlank(message = "Conference type is required")
    private String conferenceType;

    @NotBlank(message = "Paper title is required")
    private String paperTitle;

    private LocalDate fromDate;
    private LocalDate toDate;
    
    @NotBlank(message = "Institute name is required")
    private String instituteName;

    @NotBlank(message = "Department code is required")
    private String deptCode;
}
