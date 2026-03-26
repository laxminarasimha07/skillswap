package com.skillswap.config;

import com.skillswap.model.StringListConverter;
import org.hibernate.boot.MetadataBuilder;
import org.hibernate.boot.spi.MetadataBuilderContributor;

public class HibernateMetadataBuilderContributor implements MetadataBuilderContributor {

    @Override
    public void contribute(MetadataBuilder metadataBuilder) {
        metadataBuilder.applyAttributeConverter(StringListConverter.class);
    }
}
