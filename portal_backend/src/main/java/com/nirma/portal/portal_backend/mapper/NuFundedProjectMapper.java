//package com.nirma.portal.portal_backend.mapper;
//
//import java.util.List;
//import org.mapstruct.Mapper;
//import com.nirma.portal.portal_backend.dto.NuFundedProjectRequestDTO;
//import com.nirma.portal.portal_backend.dto.NuFundedProjectResponseDTO;
//import com.nirma.portal.portal_backend.entity.NuFundedProject;
//
//@Mapper(componentModel = "spring")
//public interface NuFundedProjectMapper {
//    NuFundedProjectResponseDTO toResponseDTO(NuFundedProject entity);
//    NuFundedProject toEntity(NuFundedProjectRequestDTO dto);
//    List<NuFundedProjectResponseDTO> toResponseDTOList(List<NuFundedProject> entities);
//}

package com.nirma.portal.portal_backend.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import com.nirma.portal.portal_backend.dto.NuFundedProjectRequestDTO;
import com.nirma.portal.portal_backend.dto.NuFundedProjectResponseDTO;
import com.nirma.portal.portal_backend.entity.Projects;

@Mapper(componentModel = "spring")
public interface NuFundedProjectMapper {

    NuFundedProjectResponseDTO toResponseDTO(Projects entity);

    List<NuFundedProjectResponseDTO> toResponseDTOList(List<Projects> entities);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "projectType", constant = "NuFundedProject")
    @Mapping(target = "fundingAgencyName", ignore = true)   // set to "Nirma" by @PrePersist
    @Mapping(target = "statusOfTheProject", ignore = true)
    Projects toEntity(NuFundedProjectRequestDTO dto);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "projectType", ignore = true)
    @Mapping(target = "fundingAgencyName", ignore = true)
    @Mapping(target = "statusOfTheProject", ignore = true)
    void updateEntity(@MappingTarget Projects entity, NuFundedProjectRequestDTO dto);
}