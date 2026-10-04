package com.nirma.portal.portal_backend.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class StudentTypeCountResponseDTO {
    private String studentType;
    private Long count;
}