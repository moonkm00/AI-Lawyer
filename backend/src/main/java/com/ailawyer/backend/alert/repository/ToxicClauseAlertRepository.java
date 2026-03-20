package com.ailawyer.backend.alert.repository;

import com.ailawyer.backend.alert.entity.ToxicClauseAlert;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ToxicClauseAlertRepository extends JpaRepository<ToxicClauseAlert, Long> {
    List<ToxicClauseAlert> findByContractId(Long contractId);
}
