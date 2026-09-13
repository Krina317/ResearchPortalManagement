package com.nirma.portal.portal_backend.mapper;

import java.util.List;
import org.mapstruct.Mapper;
import com.nirma.portal.portal_backend.dto.ExternalFundedProjectRequestDTO;
import com.nirma.portal.portal_backend.dto.ExternalFundedProjectResponseDTO;
import com.nirma.portal.portal_backend.entity.ExternalFundedProject;

@Mapper(componentModel = "spring")
public interface ExternalFundedProjectMapper {
    ExternalFundedProjectResponseDTO toResponseDTO(ExternalFundedProject entity);
    ExternalFundedProject toEntity(ExternalFundedProjectRequestDTO dto);
    List<ExternalFundedProjectResponseDTO> toResponseDTOList(List<ExternalFundedProject> entities);
}