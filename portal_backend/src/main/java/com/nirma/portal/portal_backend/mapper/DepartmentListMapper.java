package com.nirma.portal.portal_backend.mapper;

import java.util.List;

import org.mapstruct.Mapper;

import com.nirma.portal.portal_backend.DTO.DepartmentListRequestDTO;
import com.nirma.portal.portal_backend.DTO.DepartmentListResponseDTO;
import com.nirma.portal.portal_backend.entity.DepartmentList;

@Mapper(componentModel = "spring")
public interface DepartmentListMapper {

    DepartmentListResponseDTO toResponseDTO(DepartmentList entity);

    DepartmentList toEntity(DepartmentListRequestDTO dto);

    List<DepartmentListResponseDTO> toResponseDTOList(List<DepartmentList> entities);
}