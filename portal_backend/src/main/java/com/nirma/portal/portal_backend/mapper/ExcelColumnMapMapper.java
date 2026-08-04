package com.nirma.portal.portal_backend.mapper;

import java.util.List;

import org.mapstruct.Mapper;

import com.nirma.portal.portal_backend.DTO.ExcelColumnMapRequestDTO;
import com.nirma.portal.portal_backend.DTO.ExcelColumnMapResponseDTO;
import com.nirma.portal.portal_backend.entity.ExcelColumnMap;

@Mapper(componentModel = "spring")
public interface ExcelColumnMapMapper {

    ExcelColumnMapResponseDTO toResponseDTO(ExcelColumnMap entity);

    ExcelColumnMap toEntity(ExcelColumnMapRequestDTO dto);

    List<ExcelColumnMapResponseDTO> toResponseDTOList(List<ExcelColumnMap> entities);
}