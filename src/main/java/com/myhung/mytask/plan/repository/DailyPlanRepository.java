package com.myhung.mytask.plan.repository;

import com.myhung.mytask.plan.entity.DailyPlan;
import java.time.LocalDate;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DailyPlanRepository extends JpaRepository<DailyPlan, Long> {

    Optional<DailyPlan> findByPlanDate(LocalDate planDate);
}
