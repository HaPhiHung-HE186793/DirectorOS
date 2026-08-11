package com.myhung.mytask.plan.repository;

import com.myhung.mytask.plan.entity.PlanItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PlanItemRepository extends JpaRepository<PlanItem, Long> {
}
