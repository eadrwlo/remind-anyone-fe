import { StyleSheet, Text, TouchableOpacity, TouchableOpacityProps, ViewStyle } from 'react-native';

interface AppButtonProps extends TouchableOpacityProps {
    title: string;
    /** Background color — defaults to app tint blue */
    color?: string;
    /** Makes the button fill the full width of its container */
    fullWidth?: boolean;
    /** Compact / small variant (e.g. inline "Add" button) */
    compact?: boolean;
}

export function AppButton({
    title,
    color = '#0a7ea4',
    fullWidth = true,
    compact = false,
    disabled,
    style,
    ...rest
}: AppButtonProps) {
    return (
        <TouchableOpacity
            activeOpacity={0.8}
            disabled={disabled}
            style={[
                styles.btn,
                compact ? styles.btnCompact : styles.btnFull,
                fullWidth && !compact && styles.fullWidth,
                { backgroundColor: disabled ? '#aaa' : color },
                style as ViewStyle,
            ]}
            {...rest}
        >
            <Text style={[styles.text, compact && styles.textCompact]}>{title}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    btn: {
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 4,
    },
    btnFull: {
        height: 54,
        paddingHorizontal: 24,
    },
    btnCompact: {
        height: 42,
        paddingHorizontal: 18,
        borderRadius: 12,
    },
    fullWidth: {
        width: '100%',
    },
    text: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
        letterSpacing: 0.3,
    },
    textCompact: {
        fontSize: 14,
    },
});
