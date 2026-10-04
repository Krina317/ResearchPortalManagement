package com.nirma.portal.portal_backend.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ReviewDecisionRequestDTO {

    /** true = this author is Nirma faculty, false = not faculty. */
    @NotNull
    private Boolean isFaculty;

    /** Needed only when isFaculty is true and there is no suggested faculty on the author. */
    private Long facultyId;
}