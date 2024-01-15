import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from 'react-native';
import axios from 'axios';

import {Colors, Header} from 'react-native/Libraries/NewAppScreen';

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const [stories, setStories] = useState([]);

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const {data: storyIds} = await axios.get(
          'https://hacker-news.firebaseio.com/v0/topstories.json',
        );
        const storyPromises = storyIds
          .slice(0, 10)
          .map((id: any) =>
            axios.get(`https://hacker-news.firebaseio.com/v0/item/${id}.json`),
          );
        const stories = await Promise.all(storyPromises);
        setStories(stories.map(story => story.data));
      } catch (error) {
        console.error('Error fetching stories:', error);
      }
    };

    fetchStories();
  }, []);

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <Header />
        {stories.map((story, index) => (
          <View key={story.id} style={styles.storyContainer}>
            <Text style={styles.storyTitle}>
              {index + 1}. {story.title}
            </Text>
            <Text style={styles.storyAuthor}>By {story.by}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  storyContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
  },
  storyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  storyAuthor: {
    fontSize: 14,
    color: '#555555',
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
