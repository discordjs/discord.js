/*
 * Copyright (c) 2018 amy, All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, this
 *    list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the
 *    documentation and/or other materials provided with the distribution.
 * 3. Neither the name of the copyright holder nor the names of its contributors
 *    may be used to endorse or promote products derived from this software without
 *    specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

package com.mewna.catnip.entity.builder;

import com.mewna.catnip.entity.impl.EmbedImpl;
import com.mewna.catnip.entity.impl.EmbedImpl.*;
import com.mewna.catnip.entity.message.Embed;
import com.mewna.catnip.entity.message.Embed.Image;
import com.mewna.catnip.entity.message.Embed.*;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.Accessors;

import javax.annotation.CheckReturnValue;
import javax.annotation.Nonnegative;
import javax.annotation.Nonnull;
import javax.annotation.Nullable;
import java.awt.*;
import java.time.*;
import java.time.format.DateTimeFormatter;
import java.time.temporal.TemporalAccessor;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * Build a new embed to be used via the REST API.
 *
 * @author amy
 * @since 9/4/18.
 */
@Setter(onParam_ = @Nullable, onMethod_ = {@CheckReturnValue, @Nonnull})
@NoArgsConstructor
@Accessors(fluent = true, chain = true)
@SuppressWarnings({"WeakerAccess", "unused"})
public class EmbedBuilder {
    private final List<Field> fields = new ArrayList<>(25);
    // @formatter:off
    private String title;
    private String description;
    private String url;
    private Integer color;
    private OffsetDateTime timestamp;
    private Footer footer;
    private Image image;
    private Thumbnail thumbnail;
    private Author author;
    // @formatter:on
    
    public EmbedBuilder(final Embed embed) {
        title = embed.title();
        description = embed.description();
        url = embed.url();
        color = embed.color();
        timestamp = embed.timestamp();
        footer = embed.footer();
        image = embed.image();
        thumbnail = embed.thumbnail();
        author = embed.author();
        fields.addAll(embed.fields());
    }
    
    /**
     * Sets the timestamp of the embed. A {@link TemporalAccessor} that isn't an {@link OffsetDateTime}
     * will be converted to one if possible.
     *
     * @param temporal A {@link TemporalAccessor} to set.
     * @throws DateTimeException If the {@link TemporalAccessor} cannot be converted to an {@link OffsetDateTime}.
     * @return Itself.
     */
    @Nonnull
    @CheckReturnValue
    public EmbedBuilder timestamp(@Nullable final TemporalAccessor temporal) {
        if(temporal == null) {
            timestamp = null;
            return this;
        }
        if(temporal instanceof OffsetDateTime) {
            timestamp = (OffsetDateTime) temporal;
            return this;
        }
        ZoneOffset offset;
        try {
            offset = ZoneOffset.from(temporal);
        } catch(final DateTimeException ignored) {
            offset = ZoneOffset.UTC;
        }
        try {
            timestamp = OffsetDateTime.of(LocalDateTime.from(temporal), offset);
        } catch(final DateTimeException ignored) {
            try {
                timestamp = OffsetDateTime.ofInstant(Instant.from(temporal), offset);
            } catch(final DateTimeException exc) {
                throw new DateTimeException("Unable to obtain OffsetDateTime from TemporalAccessor: " +
                        temporal + " of type " + temporal.getClass().getName(), exc);
            }
        }
        return this;
    }
    
    /**
     * Set the color of the embed. The alpha bits will be ignored.
     *
     * @param color The color to set.
     *
     * @return Itself.
     */
    @Nonnull
    @CheckReturnValue
    public EmbedBuilder color(@Nullable final Color color) {
        if(color != null) {
            // Mask off the alpha bits
            this.color = color.getRGB() & 0x00FFFFFF;
        } else {
            this.color = null;
        }
        return this;
    }
    
    /**
     * Set the color of the embed. The alpha bits will be ignored.
     *
     * @param color The color to set.
     *
     * @return Itself.
     */
    @Nonnull
    @CheckReturnValue
    public EmbedBuilder color(@Nullable final Integer color) {
        if(color != null) {
            // Mask off the alpha bits
            this.color = color & 0x00FFFFFF;
        } else {
            this.color = null;
        }
        return this;
    }
    
    /**
     * Add a footer to the embed.
     *
     * @param text    The text of the footer.
     * @param iconUrl The URL of the icon in the embed's footer.
     *
     * @return Itself.
     */
    @Nonnull
    @CheckReturnValue
    public EmbedBuilder footer(@Nullable final String text, @Nullable final String iconUrl) {
        return footer(new FooterImpl(text, iconUrl, null));
    }
    
    /**
     * Set the embed's image.
     *
     * @param url The URL of the image.
     *
     * @return Itself.
     */
    @Nonnull
    @CheckReturnValue
    public EmbedBuilder image(@Nullable final String url) {
        image = new ImageImpl(url, null, 0, 0);
        return this;
    }
    
    /**
     * Set the embed's thumbnail.
     *
     * @param url The URL of the thumbnail image.
     *
     * @return Itself.
     */
    @Nonnull
    @CheckReturnValue
    public EmbedBuilder thumbnail(@Nullable final String url) {
        thumbnail = new ThumbnailImpl(url, null, 0, 0);
        return this;
    }
    
    /**
     * Set the embed's author.
     *
     * @param name The author's name.
     *
     * @return Itself.
     */
    @Nonnull
    @CheckReturnValue
    public EmbedBuilder author(@Nullable final String name) {
        return author(name, null);
    }
    
    /**
     * Set the embed's author.
     *
     * @param name The author's name.
     * @param url  The URL of the author's page.
     *
     * @return Itself.
     */
    @Nonnull
    @CheckReturnValue
    public EmbedBuilder author(@Nullable final String name, @Nullable final String url) {
        return author(name, url, null);
    }
    
    /**
     * Set the embed's author.
     *
     * @param name    The author's name.
     * @param url     The URL of the author's page.
     * @param iconUrl The URL for the author's icon.
     *
     * @return Itself.
     */
    @Nonnull
    @CheckReturnValue
    public EmbedBuilder author(@Nullable final String name, @Nullable final String url, @Nullable final String iconUrl) {
        return author(new AuthorImpl(name, url, iconUrl, null));
    }
    
    /**
     * Set the embed's author.
     *
     * @param author The new author.
     *
     * @return Itself.
     */
    @Nonnull
    @CheckReturnValue
    public EmbedBuilder author(@Nullable final Author author) {
        this.author = author;
        return this;
    }
    
    /**
     * Add a new field to the embed.
     *
     * @param name   The field's name.
     * @param value  The field's value.
     * @param inline Whether or not the field should be inline.
     *
     * @return Itself.
     */
    @Nonnull
    @CheckReturnValue
    public EmbedBuilder field(@Nonnull final String name, @Nonnull final String value, final boolean inline) {
        return field(new FieldImpl(name, value, inline));
    }
    
    /**
     * Add a new field to the embed.
     *
     * @param field The field to add.
     *
     * @return Itself.
     *
     * @throws IllegalStateException If more than 25 fields are added.
     */
    @Nonnull
    @CheckReturnValue
    public EmbedBuilder field(@Nonnull final Field field) {
        if(fields.size() == 25) {
            throw new IllegalStateException("Tried to add an embed field, but we're at the cap (25)!");
        }
        fields.add(field);
        return this;
    }
    
    /**
     * Replaces the field associated with a specific index with a new field more efficiently.
     * @param index The <b>non-negative and under-25</b> index of the field to replace.
     * @param name The <b>non-null</b> name of the new field.
     * @param value The <b>non-null</b> value of the new field.
     * @param inline Whether or not the field should be inline.
     * @return Itself.
     */
    @Nonnull
    @CheckReturnValue
    public EmbedBuilder replaceAtIndex(@Nonnegative final int index, @Nonnull final String name, @Nonnull final String value, final boolean inline) {
        return replaceAtIndex(index, new FieldImpl(name, value, inline));
    }
    
    /**
     * Replaces the field associated with a specific index with a new field more efficiently.
     * @param index The <b>non-negative and under-25</b> index of the field to replace.
     * @param field The <b>non-null</b> {@link Field field} instance.
     * @throws IndexOutOfBoundsException If the field index is smaller than 0, larger than 24 or larger or equal to the amount of fields added.
     * @return Itself.
     */
    
    @Nonnull
    @CheckReturnValue
    public EmbedBuilder replaceAtIndex(@Nonnegative final int index, @Nonnull final Field field) {
        if (index < 0 || index > 24 || index >= fields.size()) {
            throw new IndexOutOfBoundsException("Tried to set a field with an out-of-bounds index!");
        }
        fields.set(index, field);
        return this;
    }
    
    /**
     * Build the embed.
     *
     * @return The new embed.
     */
    public Embed build() {
        int len = 0;
        final EmbedImplBuilder builder = EmbedImpl.builder();
        if(title != null && !title.isEmpty()) {
            if(title.length() > 256) {
                throw new IllegalStateException("Title exceeds 256 characters!");
            }
            len += title.length();
            builder.title(title);
        }
        if(description != null && !description.isEmpty()) {
            if(description.length() > 2048) {
                throw new IllegalStateException("Description exceeds 2048 characters!");
            }
            builder.description(description);
            len += description.length();
        }
        if(url != null && !url.isEmpty()) {
            builder.url(url);
        }
        if(color != null) {
            builder.color(color);
        }
        if(timestamp != null) {
            builder.timestamp(timestamp.format(DateTimeFormatter.ISO_INSTANT));
        }
        if(footer != null) {
            if(footer.text().length() > 2048) {
                throw new IllegalStateException("Footer text exceeds 2048 characters!");
            }
            builder.footer(footer);
            len += footer.text().length();
        }
        if(image != null) {
            builder.image(image);
        }
        if(thumbnail != null) {
            builder.thumbnail(thumbnail);
        }
        if(author != null) {
            if(author.name().length() > 256) {
                throw new IllegalStateException("Author's name exceeds 256 characters!");
            }
            len += author.name().length();
            builder.author(author);
        }
        if(fields.isEmpty()) {
            builder.fields(Collections.emptyList());
        } else {
            if(fields.size() > 25) {
                throw new IllegalStateException("Tried to add an embed field, but we're at the cap (25)!");
            }
            for(final Field field : fields) {
                if(field.name().length() > 256) {
                    throw new IllegalStateException("Field name exceeds 256 characters!");
                }
                if(field.value().length() > 1024) {
                    throw new IllegalStateException("Field value exceeds 1024 characters!");
                }
                len += field.name().length();
                len += field.value().length();
            }
            builder.fields(fields);
        }
        if(len > 6000) {
            throw new IllegalStateException("Total embed length exceeds 6000 characters!");
        }
        return builder.build();
    }
}