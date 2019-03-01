package com.mewna.catnip.entity;

/**
 * @author Nik Ammerlaan
 * @since 2/3/19.
 */
public interface Mentionable {
    /**
     * @return A mention for this entity that can be sent in a message.
     */
    String asMention();
}
