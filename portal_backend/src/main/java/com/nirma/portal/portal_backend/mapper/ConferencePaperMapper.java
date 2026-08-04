package com.nirma.portal.portal_backend.mapper;

import java.util.List;

import org.mapstruct.Mapper;

import com.nirma.portal.portal_backend.DTO.ConferencePaperRequestDTO;
import com.nirma.portal.portal_backend.DTO.ConferencePaperResponseDTO;
import com.nirma.portal.portal_backend.entity.ConferencePaper;

@Mapper(componentModel = "spring")
public interface ConferencePaperMapper {
    ConferencePaperResponseDTO toResponseDTO(ConferencePaper entity);

    ConferencePaper toEntity(ConferencePaperRequestDTO dto);

    List<ConferencePaperResponseDTO> toResponseDTOList(List<ConferencePaper> entities);
}
