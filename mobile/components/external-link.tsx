import { Href, Link } from 'expo-router';
import { Linking } from 'react-native';
import { type ComponentProps } from 'react';

/**
 * ExternalLink – a thin wrapper around expo-router `Link`.
 * For web it opens in a new tab (`target="_blank"`).
 * For native it uses React Native's `Linking.openURL` to launch the default browser.
 */
type Props = Omit<ComponentProps<typeof Link>, 'href'> & { href: Href & string };

export function ExternalLink({ href, ...rest }: Props) {
  const handlePress = async (event: any) => {
    if (process.env.EXPO_OS !== 'web') {
      // Prevent default navigation that would try to open inside the app.
      event.preventDefault?.();
      await Linking.openURL(href);
    }
  };

  return (
    <Link target="_blank" {...rest} href={href} onPress={handlePress} />
  );
}
