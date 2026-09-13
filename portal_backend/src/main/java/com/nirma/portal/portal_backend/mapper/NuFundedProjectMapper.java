package com.nirma.portal.portal_backend.mapper;

import java.util.List;
import org.mapstruct.Mapper;
import com.nirma.portal.portal_backend.dto.NuFundedProjectRequestDTO;
import com.nirma.portal.portal_backend.dto.NuFundedProjectResponseDTO;
import com.nirma.portal.portal_backend.entity.NuFundedProject;

@Mapper(componentModel = "spring")
public interface NuFundedProjectMapper {
    NuFundedProjectResponseDTO toResponseDTO(NuFundedProject entity);
    NuFundedProject toEntity(NuFundedProjectRequestDTO dto);
    List<NuFundedProjectResponseDTO> toResponseDTOList(List<NuFundedProject> entities);
}