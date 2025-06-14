import { Link, Stack } from 'expo-router';
import { notFoundStyles as styles } from '@/src/styles';

import { Text, View } from '@/components/Themed';
import { ExternalLink } from '@/components/ExternalLink';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: '404 Not Found' }} />
      <View style={styles.container}>
        <Text style={styles.title}>Users shouldn't be seeing this!</Text>
        <Text style={styles.subtitle}>If you are a user, please do one of the following:</Text>
        
        <View style={styles.optionsContainer}>
          <Text style={styles.option}>• Open an issue on GitHub:</Text>
          <ExternalLink href="https://github.com/postaverse/postaverse-app/issues/new" style={styles.externalLink}>
            <Text style={styles.linkText}>GitHub Issues</Text>
          </ExternalLink>
          
          <Text style={styles.option}>• Email Zander Lewis at:</Text>
          <ExternalLink href="mailto:zander@zanderlewis.dev" style={styles.externalLink}>
            <Text style={styles.linkText}>zander@zanderlewis.dev</Text>
          </ExternalLink>
        </View>

        <Link href="/" style={styles.homeLink}>
          <Text style={styles.homeLinkText}>Go to home screen!</Text>
        </Link>
      </View>
    </>
  );
}
