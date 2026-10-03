package com.nirma.portal.portal_backend.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import com.nirma.portal.portal_backend.dto.ExternalFundedProjectRequestDTO;
import com.nirma.portal.portal_backend.dto.ExternalFundedProjectResponseDTO;
import com.nirma.portal.portal_backend.entity.Projects;

@Mapper(componentModel = "spring")
public interface ExternalFundedProjectMapper {

    ExternalFundedProjectResponseDTO toResponseDTO(Projects entity);

    List<ExternalFundedProjectResponseDTO> toResponseDTOList(List<Projects> entities);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "projectType", constant = "ExternalFundedProject")
    @Mapping(target = "nuProjectCategory", ignore = true)
    @Mapping(target = "ugStudentDetailList", ignore = true)
    Projects toEntity(ExternalFundedProjectRequestDTO dto);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "projectType", ignore = true)
    @Mapping(target = "nuProjectCategory", ignore = true)
    @Mapping(target = "ugStudentDetailList", ignore = true)
    void updateEntity(@MappingTarget Projects entity, ExternalFundedProjectRequestDTO dto);
}