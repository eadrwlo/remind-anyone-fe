import { IconSymbol } from '@/components/ui/icon-symbol';
import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Animated,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ViewToken,
    useWindowDimensions,
} from 'react-native';

const MOBILE_BREAKPOINT = 768;

const SLIDES = [
    {
        id: '1',
        icon: 'bell.fill' as const,
        iconColor: '#4A90D9',
        accentColor: '#EBF4FF',
        titleKey: 'welcome.slide1.title',
        subtitleKey: 'welcome.slide1.subtitle',
        bullets: [
            { icon: 'checkmark.circle.fill' as const, textKey: 'welcome.slide1.bullet1' },
            { icon: 'checkmark.circle.fill' as const, textKey: 'welcome.slide1.bullet2' },
            { icon: 'checkmark.circle.fill' as const, textKey: 'welcome.slide1.bullet3' },
        ],
    },
    {
        id: '2',
        icon: 'person.2.fill' as const,
        iconColor: '#43A047',
        accentColor: '#F0FBF0',
        titleKey: 'welcome.slide2.title',
        subtitleKey: 'welcome.slide2.subtitle',
        bullets: [
            { icon: 'checkmark.circle.fill' as const, textKey: 'welcome.slide2.bullet1' },
            { icon: 'checkmark.circle.fill' as const, textKey: 'welcome.slide2.bullet2' },
            { icon: 'checkmark.circle.fill' as const, textKey: 'welcome.slide2.bullet3' },
        ],
    },
    {
        id: '3',
        icon: 'paperplane.fill' as const,
        iconColor: '#8B5CF6',
        accentColor: '#F5F0FF',
        titleKey: 'welcome.slide3.title',
        subtitleKey: 'welcome.slide3.subtitle',
        bullets: [
            { icon: 'checkmark.circle.fill' as const, textKey: 'welcome.slide3.bullet1' },
            { icon: 'checkmark.circle.fill' as const, textKey: 'welcome.slide3.bullet2' },
            { icon: 'checkmark.circle.fill' as const, textKey: 'welcome.slide3.bullet3' },
        ],
    },
];

// ─── Shared slide card ────────────────────────────────────────────────────────
function SlideCard({
    item,
    cardWidth,
    compact = false,
}: {
    item: typeof SLIDES[0];
    cardWidth: number;
    compact?: boolean;
}) {
    const { t } = useTranslation();
    return (
        <View style={[styles.slide, { width: cardWidth }]}>
            {/* Hero icon area */}
            <View style={[styles.iconWrapper, { backgroundColor: item.accentColor, height: compact ? 180 : 220 }]}>
                <View style={[styles.iconCircle, { backgroundColor: item.iconColor + '22' }]}>
                    <View style={[styles.iconInner, { backgroundColor: item.iconColor + '33' }]}>
                        <IconSymbol name={item.icon} size={compact ? 40 : 52} color={item.iconColor} />
                    </View>
                </View>
            </View>

            {/* Text content */}
            <View style={styles.textContent}>
                <Text style={[styles.title, compact && styles.titleCompact]}>{t(item.titleKey)}</Text>
                <Text style={styles.subtitle}>{t(item.subtitleKey)}</Text>

                {/* Bullets */}
                <View style={styles.bullets}>
                    {item.bullets.map((b: { icon: typeof SLIDES[0]['bullets'][0]['icon']; textKey: string }, i: number) => (
                        <View key={i} style={styles.bulletRow}>
                            <IconSymbol name={b.icon} size={18} color={item.iconColor} />
                            <Text style={styles.bulletText}>{t(b.textKey)}</Text>
                        </View>
                    ))}
                </View>
            </View>
        </View>
    );
}

// ─── Desktop layout ───────────────────────────────────────────────────────────
function DesktopWelcome() {
    const router = useRouter();
    const { width } = useWindowDimensions();
    const { t } = useTranslation();
    const cardWidth = Math.min(320, (width - 120) / 3);

    return (
        <View style={styles.desktopContainer}>
            {/* Header */}
            <View style={styles.desktopHeader}>
                <Text style={styles.desktopAppName}>{t('welcome.desktop.appName')}</Text>
                <Text style={styles.desktopTagline}>{t('welcome.desktop.tagline')}</Text>
            </View>

            {/* Cards row */}
            <View style={styles.desktopCards}>
                {SLIDES.map((slide) => (
                    <View key={slide.id} style={[styles.desktopCard, { width: cardWidth }]}>
                        <SlideCard item={slide} cardWidth={cardWidth} compact />
                    </View>
                ))}
            </View>

            {/* CTA */}
            <TouchableOpacity
                style={[styles.desktopBtn, { backgroundColor: '#4A90D9' }]}
                onPress={() => router.replace('/(auth)/login')}
                activeOpacity={0.85}
            >
                <Text style={styles.btnText}>{t('welcome.getStarted')}</Text>
                <IconSymbol name="chevron.right" size={18} color="#fff" />
            </TouchableOpacity>
        </View>
    );
}

// ─── Mobile layout (swipeable) ────────────────────────────────────────────────
function MobileWelcome() {
    const router = useRouter();
    const { width } = useWindowDimensions();
    const { t } = useTranslation();
    const [activeIndex, setActiveIndex] = useState(0);
    const flatListRef = useRef<FlatList>(null);
    const scrollX = useRef(new Animated.Value(0)).current;

    const onViewableItemsChanged = useRef(
        ({ viewableItems }: { viewableItems: ViewToken[] }) => {
            if (viewableItems.length > 0) {
                setActiveIndex(viewableItems[0].index ?? 0);
            }
        }
    ).current;

    const goToNext = () => {
        if (activeIndex < SLIDES.length - 1) {
            flatListRef.current?.scrollToIndex({ index: activeIndex + 1, animated: true });
        } else {
            router.replace('/(auth)/login');
        }
    };

    const isLast = activeIndex === SLIDES.length - 1;

    return (
        <View style={styles.container}>
            <FlatList
                ref={flatListRef}
                data={SLIDES}
                keyExtractor={(item) => item.id}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
                    useNativeDriver: false,
                })}
                scrollEventThrottle={16}
                getItemLayout={(_, index) => ({ length: width, offset: width * index, index })}
                onViewableItemsChanged={onViewableItemsChanged}
                viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
                renderItem={({ item }) => <SlideCard item={item} cardWidth={width} />}
            />

            {/* Footer */}
            <View style={styles.footer}>
                {/* Dots */}
                <View style={styles.dots}>
                    {SLIDES.map((_, i) => {
                        const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
                        const dotWidth = scrollX.interpolate({
                            inputRange,
                            outputRange: [8, 24, 8],
                            extrapolate: 'clamp',
                        });
                        const opacity = scrollX.interpolate({
                            inputRange,
                            outputRange: [0.3, 1, 0.3],
                            extrapolate: 'clamp',
                        });
                        return (
                            <Animated.View
                                key={i}
                                style={[
                                    styles.dot,
                                    { width: dotWidth, opacity, backgroundColor: SLIDES[activeIndex].iconColor },
                                ]}
                            />
                        );
                    })}
                </View>

                {/* CTA button */}
                <TouchableOpacity
                    style={[styles.btn, { backgroundColor: SLIDES[activeIndex].iconColor }]}
                    onPress={goToNext}
                    activeOpacity={0.85}
                >
                    <Text style={styles.btnText}>{isLast ? t('welcome.getStarted') : t('welcome.next')}</Text>
                    <IconSymbol name="chevron.right" size={18} color="#fff" />
                </TouchableOpacity>

                {/* Skip */}
                {!isLast && (
                    <TouchableOpacity onPress={() => router.replace('/(auth)/login')} style={styles.skip}>
                        <Text style={styles.skipText}>{t('welcome.skip')}</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}

// ─── Root: choose layout by screen width ──────────────────────────────────────
export default function WelcomeScreen() {
    const { width } = useWindowDimensions();
    return width >= MOBILE_BREAKPOINT ? <DesktopWelcome /> : <MobileWelcome />;
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
    // Shared
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    slide: {
        flex: 1,
    },
    iconWrapper: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconCircle: {
        width: 150,
        height: 150,
        borderRadius: 75,
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconInner: {
        width: 108,
        height: 108,
        borderRadius: 54,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textContent: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 24,
    },
    title: {
        fontSize: 26,
        fontWeight: '800',
        color: '#111',
        lineHeight: 34,
        marginBottom: 10,
    },
    titleCompact: {
        fontSize: 20,
        lineHeight: 26,
    },
    subtitle: {
        fontSize: 14,
        color: '#555',
        lineHeight: 21,
        marginBottom: 20,
    },
    bullets: {
        gap: 10,
    },
    bulletRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    bulletText: {
        fontSize: 13,
        color: '#333',
        fontWeight: '500',
    },
    btnText: {
        color: '#fff',
        fontSize: 17,
        fontWeight: '700',
        letterSpacing: 0.3,
    },

    // Mobile only
    footer: {
        paddingHorizontal: 30,
        paddingBottom: 50,
        paddingTop: 20,
        alignItems: 'center',
        gap: 16,
        backgroundColor: '#fff',
    },
    dots: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    dot: {
        height: 8,
        borderRadius: 4,
    },
    btn: {
        width: '100%',
        height: 54,
        borderRadius: 16,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 4,
    },
    skip: {
        paddingVertical: 4,
    },
    skipText: {
        color: '#999',
        fontSize: 14,
    },

    // Desktop only
    desktopContainer: {
        flex: 1,
        backgroundColor: '#f7f9fc',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
        paddingHorizontal: 40,
    },
    desktopHeader: {
        alignItems: 'center',
        marginBottom: 48,
    },
    desktopAppName: {
        fontSize: 36,
        fontWeight: '900',
        color: '#111',
        marginBottom: 10,
        letterSpacing: -0.5,
    },
    desktopTagline: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        maxWidth: 480,
        lineHeight: 24,
    },
    desktopCards: {
        flexDirection: 'row',
        gap: 24,
        marginBottom: 48,
    },
    desktopCard: {
        backgroundColor: '#fff',
        borderRadius: 20,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 16,
        elevation: 4,
    },
    desktopBtn: {
        height: 54,
        paddingHorizontal: 48,
        borderRadius: 16,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
        shadowColor: '#4A90D9',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
});
