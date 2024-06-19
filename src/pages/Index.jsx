import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';

const Index = () => {
  const [stories, setStories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const fetchTopStories = async () => {
      try {
        const { data: topStoryIds } = await axios.get('https://hacker-news.firebaseio.com/v0/topstories.json');
        const top5StoryIds = topStoryIds.slice(0, 5);
        const storyPromises = top5StoryIds.map(id => axios.get(`https://hacker-news.firebaseio.com/v0/item/${id}.json`));
        const storyResponses = await Promise.all(storyPromises);
        setStories(storyResponses.map(response => response.data));
      } catch (error) {
        console.error('Error fetching top stories:', error);
      }
    };

    fetchTopStories();
  }, []);

  const filteredStories = stories.filter(story => story.title.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className={`h-screen w-screen flex flex-col items-center justify-center ${darkMode ? 'dark' : ''}`}>
      <div className="absolute top-4 right-4">
        <Switch checked={darkMode} onCheckedChange={setDarkMode} />
      </div>
      <div className="w-full max-w-md p-4">
        <Input 
          placeholder="Search stories..." 
          value={searchTerm} 
          onChange={e => setSearchTerm(e.target.value)} 
        />
        <ScrollArea className="mt-4 h-[400px]">
          {filteredStories.map(story => (
            <Card key={story.id} className="mb-4">
              <CardHeader>
                <CardTitle>{story.title}</CardTitle>
                <CardDescription>{story.score} upvotes</CardDescription>
              </CardHeader>
              <CardContent>
                <a href={story.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                  Read more
                </a>
              </CardContent>
            </Card>
          ))}
        </ScrollArea>
      </div>
    </div>
  );
};

export default Index;