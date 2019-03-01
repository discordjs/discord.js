package com.mewna.catnip.entity.impl;

import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.google.errorprone.annotations.CanIgnoreReturnValue;
import com.google.errorprone.annotations.Var;
import com.mewna.catnip.entity.Snowflake;
import com.mewna.catnip.entity.misc.ApplicationInfo;
import com.mewna.catnip.entity.misc.ApplicationOwner;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.Objects;
import javax.annotation.CheckReturnValue;
import javax.annotation.Nullable;
import javax.annotation.ParametersAreNonnullByDefault;
import javax.annotation.concurrent.Immutable;
import javax.annotation.concurrent.NotThreadSafe;
import org.immutables.value.Generated;

/**
 * Builds instances of type {@link ApplicationInfoHusk ApplicationInfoHusk}.
 * Initialize attributes and then invoke the {@link #build()} method to create an
 * immutable instance.
 * <p><em>{@code ApplicationInfoBuilder} is not thread-safe and generally should not be stored in a field or collection,
 * but instead used immediately to create instances.</em>
 */
@Generated(from = "ApplicationInfoHusk", generator = "Immutables")
@SuppressWarnings({"all"})
@ParametersAreNonnullByDefault
@javax.annotation.processing.Generated("org.immutables.processor.ProxyProcessor")
@NotThreadSafe
public final class ApplicationInfoBuilder {
  private static final long INIT_BIT_NAME = 0x1L;
  private static final long INIT_BIT_PUBLIC_BOT = 0x2L;
  private static final long INIT_BIT_REQUIRES_CODE_GRANT = 0x4L;
  private static final long INIT_BIT_OWNER = 0x8L;
  private static final long INIT_BIT_ID_AS_LONG = 0x10L;
  private long initBits = 0x1fL;

  private @Nullable String name;
  private @Nullable String icon;
  private @Nullable String description;
  private List<String> rpcOrigins = new ArrayList<String>();
  private boolean publicBot;
  private boolean requiresCodeGrant;
  private @Nullable ApplicationOwner owner;
  private long idAsLong;

  /**
   * Creates a builder for {@link ApplicationInfoHusk ApplicationInfoHusk} instances.
   * <pre>
   * new ApplicationInfoBuilder()
   *    .name(String) // required {@link ApplicationInfoHusk#name() name}
   *    .icon(String | null) // nullable {@link ApplicationInfoHusk#icon() icon}
   *    .description(String | null) // nullable {@link ApplicationInfoHusk#description() description}
   *    .addRpcOrigins|addAllRpcOrigins(String) // {@link ApplicationInfoHusk#rpcOrigins() rpcOrigins} elements
   *    .publicBot(boolean) // required {@link ApplicationInfoHusk#publicBot() publicBot}
   *    .requiresCodeGrant(boolean) // required {@link ApplicationInfoHusk#requiresCodeGrant() requiresCodeGrant}
   *    .owner(com.mewna.catnip.entity.misc.ApplicationOwner) // required {@link ApplicationInfoHusk#owner() owner}
   *    .idAsLong(long) // required {@link ApplicationInfoHusk#idAsLong() idAsLong}
   *    .build();
   * </pre>
   */
  public ApplicationInfoBuilder() {
  }

  /**
   * Fill a builder with attribute values from the provided {@code com.mewna.catnip.entity.Snowflake} instance.
   * @param instance The instance from which to copy values
   * @return {@code this} builder for use in a chained invocation
   */
  @CanIgnoreReturnValue 
  public final ApplicationInfoBuilder from(Snowflake instance) {
    Objects.requireNonNull(instance, "instance");
    from((Object) instance);
    return this;
  }

  /**
   * Fill a builder with attribute values from the provided {@code com.mewna.catnip.entity.misc.ApplicationInfo} instance.
   * @param instance The instance from which to copy values
   * @return {@code this} builder for use in a chained invocation
   */
  @CanIgnoreReturnValue 
  public final ApplicationInfoBuilder from(ApplicationInfo instance) {
    Objects.requireNonNull(instance, "instance");
    from((Object) instance);
    return this;
  }

  /**
   * Fill a builder with attribute values from the provided {@code com.mewna.catnip.entity.impl.ApplicationInfoHusk} instance.
   * @param instance The instance from which to copy values
   * @return {@code this} builder for use in a chained invocation
   */
  @CanIgnoreReturnValue 
  public final ApplicationInfoBuilder from(ApplicationInfoHusk instance) {
    Objects.requireNonNull(instance, "instance");
    from((Object) instance);
    return this;
  }

  private void from(Object object) {
    if (object instanceof Snowflake) {
      Snowflake instance = (Snowflake) object;
      idAsLong(instance.idAsLong());
    }
    if (object instanceof ApplicationInfo) {
      ApplicationInfo instance = (ApplicationInfo) object;
      owner(instance.owner());
      publicBot(instance.publicBot());
      name(instance.name());
      @Nullable String iconValue = instance.icon();
      if (iconValue != null) {
        icon(iconValue);
      }
      @Nullable String descriptionValue = instance.description();
      if (descriptionValue != null) {
        description(descriptionValue);
      }
      requiresCodeGrant(instance.requiresCodeGrant());
      addAllRpcOrigins(instance.rpcOrigins());
    }
  }

  /**
   * Initializes the value for the {@link ApplicationInfoHusk#name() name} attribute.
   * @param name The value for name 
   * @return {@code this} builder for use in a chained invocation
   */
  @CanIgnoreReturnValue 
  public final ApplicationInfoBuilder name(String name) {
    this.name = Objects.requireNonNull(name, "name");
    initBits &= ~INIT_BIT_NAME;
    return this;
  }

  /**
   * Initializes the value for the {@link ApplicationInfoHusk#icon() icon} attribute.
   * @param icon The value for icon (can be {@code null})
   * @return {@code this} builder for use in a chained invocation
   */
  @CanIgnoreReturnValue 
  public final ApplicationInfoBuilder icon(@Nullable String icon) {
    this.icon = icon;
    return this;
  }

  /**
   * Initializes the value for the {@link ApplicationInfoHusk#description() description} attribute.
   * @param description The value for description (can be {@code null})
   * @return {@code this} builder for use in a chained invocation
   */
  @CanIgnoreReturnValue 
  public final ApplicationInfoBuilder description(@Nullable String description) {
    this.description = description;
    return this;
  }

  /**
   * Adds one element to {@link ApplicationInfoHusk#rpcOrigins() rpcOrigins} list.
   * @param element A rpcOrigins element
   * @return {@code this} builder for use in a chained invocation
   */
  @CanIgnoreReturnValue 
  public final ApplicationInfoBuilder addRpcOrigins(String element) {
    this.rpcOrigins.add(Objects.requireNonNull(element, "rpcOrigins element"));
    return this;
  }

  /**
   * Adds elements to {@link ApplicationInfoHusk#rpcOrigins() rpcOrigins} list.
   * @param elements An array of rpcOrigins elements
   * @return {@code this} builder for use in a chained invocation
   */
  @CanIgnoreReturnValue 
  public final ApplicationInfoBuilder addRpcOrigins(String... elements) {
    for (String element : elements) {
      this.rpcOrigins.add(Objects.requireNonNull(element, "rpcOrigins element"));
    }
    return this;
  }


  /**
   * Sets or replaces all elements for {@link ApplicationInfoHusk#rpcOrigins() rpcOrigins} list.
   * @param elements An iterable of rpcOrigins elements
   * @return {@code this} builder for use in a chained invocation
   */
  @CanIgnoreReturnValue 
  public final ApplicationInfoBuilder rpcOrigins(Iterable<String> elements) {
    this.rpcOrigins.clear();
    return addAllRpcOrigins(elements);
  }

  /**
   * Adds elements to {@link ApplicationInfoHusk#rpcOrigins() rpcOrigins} list.
   * @param elements An iterable of rpcOrigins elements
   * @return {@code this} builder for use in a chained invocation
   */
  @CanIgnoreReturnValue 
  public final ApplicationInfoBuilder addAllRpcOrigins(Iterable<String> elements) {
    for (String element : elements) {
      this.rpcOrigins.add(Objects.requireNonNull(element, "rpcOrigins element"));
    }
    return this;
  }

  /**
   * Initializes the value for the {@link ApplicationInfoHusk#publicBot() publicBot} attribute.
   * @param publicBot The value for publicBot 
   * @return {@code this} builder for use in a chained invocation
   */
  @CanIgnoreReturnValue 
  public final ApplicationInfoBuilder publicBot(boolean publicBot) {
    this.publicBot = publicBot;
    initBits &= ~INIT_BIT_PUBLIC_BOT;
    return this;
  }

  /**
   * Initializes the value for the {@link ApplicationInfoHusk#requiresCodeGrant() requiresCodeGrant} attribute.
   * @param requiresCodeGrant The value for requiresCodeGrant 
   * @return {@code this} builder for use in a chained invocation
   */
  @CanIgnoreReturnValue 
  public final ApplicationInfoBuilder requiresCodeGrant(boolean requiresCodeGrant) {
    this.requiresCodeGrant = requiresCodeGrant;
    initBits &= ~INIT_BIT_REQUIRES_CODE_GRANT;
    return this;
  }

  /**
   * Initializes the value for the {@link ApplicationInfoHusk#owner() owner} attribute.
   * @param owner The value for owner 
   * @return {@code this} builder for use in a chained invocation
   */
  @CanIgnoreReturnValue 
  public final ApplicationInfoBuilder owner(ApplicationOwner owner) {
    this.owner = Objects.requireNonNull(owner, "owner");
    initBits &= ~INIT_BIT_OWNER;
    return this;
  }

  /**
   * Initializes the value for the {@link ApplicationInfoHusk#idAsLong() idAsLong} attribute.
   * @param idAsLong The value for idAsLong 
   * @return {@code this} builder for use in a chained invocation
   */
  @CanIgnoreReturnValue 
  public final ApplicationInfoBuilder idAsLong(long idAsLong) {
    this.idAsLong = idAsLong;
    initBits &= ~INIT_BIT_ID_AS_LONG;
    return this;
  }

  /**
   * Builds a new {@link ApplicationInfoHusk ApplicationInfoHusk}.
   * @return An immutable instance of ApplicationInfo
   * @throws java.lang.IllegalStateException if any required attributes are missing
   */
  public ApplicationInfoHusk build() {
    if (initBits != 0) {
      throw new IllegalStateException(formatRequiredAttributesMessage());
    }
    return new ApplicationInfoBuilder.ApplicationInfoImpl(this);
  }

  private String formatRequiredAttributesMessage() {
    List<String> attributes = new ArrayList<>();
    if ((initBits & INIT_BIT_NAME) != 0) attributes.add("name");
    if ((initBits & INIT_BIT_PUBLIC_BOT) != 0) attributes.add("publicBot");
    if ((initBits & INIT_BIT_REQUIRES_CODE_GRANT) != 0) attributes.add("requiresCodeGrant");
    if ((initBits & INIT_BIT_OWNER) != 0) attributes.add("owner");
    if ((initBits & INIT_BIT_ID_AS_LONG) != 0) attributes.add("idAsLong");
    return "Cannot build ApplicationInfo, some of required attributes are not set " + attributes;
  }

  /**
   * Immutable implementation of {@link ApplicationInfoHusk}.
   * <p>
   * Use the builder to create immutable instances:
   * {@code new ApplicationInfoBuilder()}.
   */
  @Generated(from = "ApplicationInfoHusk", generator = "Immutables")
  @Immutable
  @CheckReturnValue
  private static final class ApplicationInfoImpl extends ApplicationInfoHusk {
    private final String name;
    private final @Nullable String icon;
    private final @Nullable String description;
    private final List<String> rpcOrigins;
    private final boolean publicBot;
    private final boolean requiresCodeGrant;
    private final ApplicationOwner owner;
    private final long idAsLong;

    private ApplicationInfoImpl(ApplicationInfoBuilder builder) {
      this.name = builder.name;
      this.icon = builder.icon;
      this.description = builder.description;
      this.rpcOrigins = createUnmodifiableList(true, builder.rpcOrigins);
      this.publicBot = builder.publicBot;
      this.requiresCodeGrant = builder.requiresCodeGrant;
      this.owner = builder.owner;
      this.idAsLong = builder.idAsLong;
    }

    /**
     * @return The value of the {@code name} attribute
     */
    @JsonProperty("name")
    @Override
    public String name() {
      return name;
    }

    /**
     * @return The value of the {@code icon} attribute
     */
    @JsonProperty("icon")
    @Override
    public @Nullable String icon() {
      return icon;
    }

    /**
     * @return The value of the {@code description} attribute
     */
    @JsonProperty("description")
    @Override
    public @Nullable String description() {
      return description;
    }

    /**
     * @return The value of the {@code rpcOrigins} attribute
     */
    @JsonProperty("rpcOrigins")
    @Override
    public List<String> rpcOrigins() {
      return rpcOrigins;
    }

    /**
     * @return The value of the {@code publicBot} attribute
     */
    @JsonProperty("publicBot")
    @Override
    public boolean publicBot() {
      return publicBot;
    }

    /**
     * @return The value of the {@code requiresCodeGrant} attribute
     */
    @JsonProperty("requiresCodeGrant")
    @Override
    public boolean requiresCodeGrant() {
      return requiresCodeGrant;
    }

    /**
     * @return The value of the {@code owner} attribute
     */
    @JsonProperty("owner")
    @Override
    public ApplicationOwner owner() {
      return owner;
    }

    /**
     * @return The value of the {@code idAsLong} attribute
     */
    @JsonProperty("idAsLong")
    @Override
    public long idAsLong() {
      return idAsLong;
    }

    /**
     * This instance is equal to all instances of {@code ApplicationInfoImpl} that have equal attribute values.
     * @return {@code true} if {@code this} is equal to {@code another} instance
     */
    @Override
    public boolean equals(@Nullable Object another) {
      if (this == another) return true;
      return another instanceof ApplicationInfoBuilder.ApplicationInfoImpl
          && equalTo((ApplicationInfoBuilder.ApplicationInfoImpl) another);
    }

    private boolean equalTo(ApplicationInfoBuilder.ApplicationInfoImpl another) {
      return name.equals(another.name)
          && Objects.equals(icon, another.icon)
          && Objects.equals(description, another.description)
          && rpcOrigins.equals(another.rpcOrigins)
          && publicBot == another.publicBot
          && requiresCodeGrant == another.requiresCodeGrant
          && owner.equals(another.owner)
          && idAsLong == another.idAsLong;
    }

    /**
     * Computes a hash code from attributes: {@code name}, {@code icon}, {@code description}, {@code rpcOrigins}, {@code publicBot}, {@code requiresCodeGrant}, {@code owner}, {@code idAsLong}.
     * @return hashCode value
     */
    @Override
    public int hashCode() {
      @Var int h = 5381;
      h += (h << 5) + name.hashCode();
      h += (h << 5) + Objects.hashCode(icon);
      h += (h << 5) + Objects.hashCode(description);
      h += (h << 5) + rpcOrigins.hashCode();
      h += (h << 5) + Boolean.hashCode(publicBot);
      h += (h << 5) + Boolean.hashCode(requiresCodeGrant);
      h += (h << 5) + owner.hashCode();
      h += (h << 5) + Long.hashCode(idAsLong);
      return h;
    }

    /**
     * Prints the immutable value {@code ApplicationInfo} with attribute values.
     * @return A string representation of the value
     */
    @Override
    public String toString() {
      return "ApplicationInfo{"
          + "name=" + name
          + ", icon=" + icon
          + ", description=" + description
          + ", rpcOrigins=" + rpcOrigins
          + ", publicBot=" + publicBot
          + ", requiresCodeGrant=" + requiresCodeGrant
          + ", owner=" + owner
          + ", idAsLong=" + idAsLong
          + "}";
    }

    /**
     * Utility type used to correctly read immutable object from JSON representation.
     * @deprecated Do not use this type directly, it exists only for the <em>Jackson</em>-binding infrastructure
     */
    @Generated(from = "ApplicationInfoHusk", generator = "Immutables")
    @Deprecated
    @SuppressWarnings("Immutable")
    @JsonAutoDetect(fieldVisibility = JsonAutoDetect.Visibility.NONE)
    static final class Json extends ApplicationInfoHusk {
      @Nullable String name;
      @Nullable String icon;
      @Nullable String description;
      @Nullable List<String> rpcOrigins = Collections.emptyList();
      boolean publicBot;
      boolean publicBotIsSet;
      boolean requiresCodeGrant;
      boolean requiresCodeGrantIsSet;
      @Nullable ApplicationOwner owner;
      long idAsLong;
      boolean idAsLongIsSet;
      @JsonProperty("name")
      public void setName(String name) {
        this.name = name;
      }
      @JsonProperty("icon")
      public void setIcon(@Nullable String icon) {
        this.icon = icon;
      }
      @JsonProperty("description")
      public void setDescription(@Nullable String description) {
        this.description = description;
      }
      @JsonProperty("rpcOrigins")
      public void setRpcOrigins(List<String> rpcOrigins) {
        this.rpcOrigins = rpcOrigins;
      }
      @JsonProperty("publicBot")
      public void setPublicBot(boolean publicBot) {
        this.publicBot = publicBot;
        this.publicBotIsSet = true;
      }
      @JsonProperty("requiresCodeGrant")
      public void setRequiresCodeGrant(boolean requiresCodeGrant) {
        this.requiresCodeGrant = requiresCodeGrant;
        this.requiresCodeGrantIsSet = true;
      }
      @JsonProperty("owner")
      public void setOwner(ApplicationOwner owner) {
        this.owner = owner;
      }
      @JsonProperty("idAsLong")
      public void setIdAsLong(long idAsLong) {
        this.idAsLong = idAsLong;
        this.idAsLongIsSet = true;
      }
      @Override
      public String name() { throw new UnsupportedOperationException(); }
      @Override
      public String icon() { throw new UnsupportedOperationException(); }
      @Override
      public String description() { throw new UnsupportedOperationException(); }
      @Override
      public List<String> rpcOrigins() { throw new UnsupportedOperationException(); }
      @Override
      public boolean publicBot() { throw new UnsupportedOperationException(); }
      @Override
      public boolean requiresCodeGrant() { throw new UnsupportedOperationException(); }
      @Override
      public ApplicationOwner owner() { throw new UnsupportedOperationException(); }
      @Override
      public long idAsLong() { throw new UnsupportedOperationException(); }
    }

    /**
     * @param json A JSON-bindable data structure
     * @return An immutable value type
     * @deprecated Do not use this method directly, it exists only for the <em>Jackson</em>-binding infrastructure
     */
    @Deprecated
    @JsonCreator(mode = JsonCreator.Mode.DELEGATING)
    static ApplicationInfoBuilder.ApplicationInfoImpl fromJson(Json json) {
      ApplicationInfoBuilder builder = new ApplicationInfoBuilder();
      if (json.name != null) {
        builder.name(json.name);
      }
      if (json.icon != null) {
        builder.icon(json.icon);
      }
      if (json.description != null) {
        builder.description(json.description);
      }
      if (json.rpcOrigins != null) {
        builder.addAllRpcOrigins(json.rpcOrigins);
      }
      if (json.publicBotIsSet) {
        builder.publicBot(json.publicBot);
      }
      if (json.requiresCodeGrantIsSet) {
        builder.requiresCodeGrant(json.requiresCodeGrant);
      }
      if (json.owner != null) {
        builder.owner(json.owner);
      }
      if (json.idAsLongIsSet) {
        builder.idAsLong(json.idAsLong);
      }
      return (ApplicationInfoBuilder.ApplicationInfoImpl) builder.build();
    }
  }

  private static <T> List<T> createSafeList(Iterable<? extends T> iterable, boolean checkNulls, boolean skipNulls) {
    ArrayList<T> list;
    if (iterable instanceof Collection<?>) {
      int size = ((Collection<?>) iterable).size();
      if (size == 0) return Collections.emptyList();
      list = new ArrayList<>();
    } else {
      list = new ArrayList<>();
    }
    for (T element : iterable) {
      if (skipNulls && element == null) continue;
      if (checkNulls) Objects.requireNonNull(element, "element");
      list.add(element);
    }
    return list;
  }

  private static <T> List<T> createUnmodifiableList(boolean clone, List<T> list) {
    switch(list.size()) {
    case 0: return Collections.emptyList();
    case 1: return Collections.singletonList(list.get(0));
    default:
      if (clone) {
        return Collections.unmodifiableList(new ArrayList<>(list));
      } else {
        if (list instanceof ArrayList<?>) {
          ((ArrayList<?>) list).trimToSize();
        }
        return Collections.unmodifiableList(list);
      }
    }
  }
}
