package com.ailawyer.backend.dashboard.repository;

import com.ailawyer.backend.dashboard.entity.ContractsEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ContractRepository extends JpaRepository<ContractsEntity, Integer> {
    List<ContractsEntity> findByUserId(Long userId);
}
