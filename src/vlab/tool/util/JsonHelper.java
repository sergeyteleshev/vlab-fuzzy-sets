package vlab.tool.util;

/**
 * Common json functions
 */
public class JsonHelper {

    /**
     * Escape json String.
     * @param sources
     * @return 
     */
    public static String escape(String sources) {
        return sources.replaceAll("\"", "!");
    }

    /**
     * Unescape json String.
     * @param sources
     * @return 
     */
    public static String unescape(String sources) {
        return sources.replaceAll("!", "\"")
                .replaceAll("&#0045;", "-");
    }
}
