package com.skillswap.config;

import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;

/**
 * Runs once at startup to ensure the skills columns are TEXT type.
 * Hibernate's ddl-auto=update never alters existing column types,
 * so this fixes any legacy jsonb / json column that Postgres would reject
 * a plain varchar insert into.
 */
@Configuration
public class SchemaInitializer {

    private static final Logger log = LoggerFactory.getLogger(SchemaInitializer.class);

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @PostConstruct
    public void fixSkillsColumnTypes() {
        try {
            // Check current column type for skills_offered
            String colType = jdbcTemplate.queryForObject(
                "SELECT data_type FROM information_schema.columns " +
                "WHERE table_name='users' AND column_name='skills_offered'",
                String.class
            );

            if (colType == null) {
                log.info("SchemaInitializer: users table or skills_offered column not found yet — skipping.");
                return;
            }

            if (!"text".equalsIgnoreCase(colType) && !"character varying".equalsIgnoreCase(colType)) {
                log.warn("SchemaInitializer: skills_offered is type '{}', converting to TEXT...", colType);

                jdbcTemplate.execute(
                    "ALTER TABLE users " +
                    "ALTER COLUMN skills_offered TYPE TEXT USING skills_offered::TEXT, " +
                    "ALTER COLUMN skills_wanted  TYPE TEXT USING skills_wanted::TEXT"
                );

                log.info("SchemaInitializer: Successfully converted skills columns to TEXT.");
            } else {
                log.info("SchemaInitializer: skills columns are already TEXT — no changes needed.");
            }

        } catch (Exception e) {
            // Table may not exist yet on first deploy — Hibernate will create it correctly
            log.info("SchemaInitializer: Could not check/alter schema (table may not exist yet): {}", e.getMessage());
        }
    }
}
