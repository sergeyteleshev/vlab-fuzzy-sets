package vlab.tool.util;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Locale;
import java.util.Map;

/**
 *  Class for i18n support.
 */
public class Localizer {

    private static Map<Locale, Map<String, String>> storage = new HashMap<Locale, Map<String, String>>();
    private static List<Locale> locales = new LinkedList<Locale>();
    
    private static Locale defaultLocale = new Locale("ru");
    private static Locale currentLocale = defaultLocale;
    
    static {
        {
            Map<String, String> ru = new HashMap<String, String>();
            ru.put("Справка", "Справка");
            storage.put(defaultLocale, ru);
            locales.add(defaultLocale);
        }
    }
    
    public static void switchLocale(Locale locale){
        currentLocale = locale;
    }
    
    public static String get(String key){
        try{
            return storage.get(currentLocale).get(key);
        } catch(Exception e){
            return storage.get(defaultLocale).get(key);
        }
    }

    public static List<Locale> getLocales() {
        List<Locale> sorted = new ArrayList<Locale>(locales);
        Collections.sort(sorted, new Comparator<Locale>() {

            public int compare(Locale o1, Locale o2) {
                if(o1.equals(currentLocale)) return -1;
                if(o2.equals(currentLocale)) return 1;
                return o1.getCountry().compareTo(o2.getCountry());
            }
        });
        return sorted;
    }
    
}
