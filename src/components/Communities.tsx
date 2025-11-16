import { useState } from 'react';
import { Users, Search, Plus, Lock, Globe, Hash, TrendingUp, MessageSquare } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import type { User } from '../App';

interface Community {
  id: string;
  name: string;
  description: string;
  subject: string;
  memberCount: number;
  messageCount: number;
  isPrivate: boolean;
  isPremium: boolean;
  createdBy: string;
  creatorName: string;
  tags: string[];
}

// Mock data
const mockCommunities: Community[] = [
  {
    id: '1',
    name: 'Mathematics - College Level',
    description: 'A community for college students studying mathematics. Share resources, ask questions, and help each other succeed.',
    subject: 'Mathematics',
    memberCount: 1247,
    messageCount: 5832,
    isPrivate: false,
    isPremium: false,
    createdBy: '1',
    creatorName: 'Sarah Johnson',
    tags: ['Calculus', 'Linear Algebra', 'Statistics'],
  },
  {
    id: '2',
    name: 'IELTS Preparation 2025',
    description: 'Preparing for IELTS? Join us for daily practice, tips, and mock tests.',
    subject: 'English',
    memberCount: 892,
    messageCount: 3241,
    isPrivate: false,
    isPremium: false,
    createdBy: '2',
    creatorName: 'Mike Anderson',
    tags: ['IELTS', 'English', 'Test Prep'],
  },
  {
    id: '3',
    name: 'Web Development Bootcamp',
    description: 'Learn web development together! From HTML/CSS to React and Node.js. Weekly coding challenges and project reviews.',
    subject: 'Programming',
    memberCount: 2134,
    messageCount: 8921,
    isPrivate: false,
    isPremium: true,
    createdBy: '4',
    creatorName: 'Alex Chen',
    tags: ['JavaScript', 'React', 'Web Dev'],
  },
  {
    id: '4',
    name: 'SAT Math Masters',
    description: 'Ace the SAT Math section! Practice problems, strategies, and expert tips.',
    subject: 'Test Prep',
    memberCount: 654,
    messageCount: 2103,
    isPrivate: false,
    isPremium: false,
    createdBy: '1',
    creatorName: 'Sarah Johnson',
    tags: ['SAT', 'Math', 'Test Prep'],
  },
  {
    id: '5',
    name: 'Physics Study Group',
    description: 'High school and college physics discussions. Share your doubts and help others understand concepts.',
    subject: 'Physics',
    memberCount: 478,
    messageCount: 1876,
    isPrivate: false,
    isPremium: false,
    createdBy: '5',
    creatorName: 'Lisa Martinez',
    tags: ['Mechanics', 'Thermodynamics', 'Electromagnetism'],
  },
  {
    id: '6',
    name: 'Spanish Conversation Club',
    description: 'Practice conversational Spanish with learners from around the world. All levels welcome!',
    subject: 'Languages',
    memberCount: 1089,
    messageCount: 4532,
    isPrivate: true,
    isPremium: false,
    createdBy: '6',
    creatorName: 'Maria Garcia',
    tags: ['Spanish', 'Conversation', 'Language Learning'],
  },
];

interface CommunitiesProps {
  user: User;
}

export function Communities({ user }: CommunitiesProps) {
  const [communities] = useState<Community[]>(mockCommunities);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const filteredCommunities = communities.filter(
    (community) =>
      community.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      community.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      community.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      community.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const trendingCommunities = [...communities]
    .sort((a, b) => b.memberCount - a.memberCount)
    .slice(0, 3);

  const handleJoinCommunity = (communityId: string) => {
    alert(`Joined community ${communityId}! (This is a demo)`);
  };

  return (
    <div className="h-full overflow-auto bg-gray-900">
      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl mb-2">Communities</h1>
            <p className="text-gray-400">Connect with learners and share knowledge</p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Community
              </Button>
            </DialogTrigger>
            <DialogContent >
              <DialogHeader>
                <DialogTitle >Create New Community</DialogTitle>
                <DialogDescription >
                  Start a new community for students to connect and learn together
                </DialogDescription>
              </DialogHeader>
              <form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="community-name">Community Name</Label>
                  <Input id="community-name" placeholder="e.g., Advanced Calculus Study Group" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="community-subject">Subject</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="math">Mathematics</SelectItem>
                      <SelectItem value="science">Science</SelectItem>
                      <SelectItem value="languages">Languages</SelectItem>
                      <SelectItem value="programming">Programming</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="community-description">Description</Label>
                  <Textarea
                    id="community-description"
                    placeholder="Describe what your community is about..."
                    rows={4}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="community-tags">Tags (comma separated)</Label>
                  <Input id="community-tags" placeholder="e.g., Calculus, Derivatives, Integrals" />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="private">Private Community</Label>
                  <input type="checkbox" id="private" className="toggle" />
                </div>
                <Button type="submit" className="w-full" onClick={() => setIsCreateDialogOpen(false)}>
                  Create Community
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Search communities by name, subject, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Trending Communities */}
        {!searchQuery && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-orange-600" />
              <h2 className="text-xl text-white">Trending Communities</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {trendingCommunities.map((community) => (
                <Card key={community.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                          <Hash className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-base text-white">{community.name}</CardTitle>
                          <CardDescription className="text-xs text-gray-400">{community.subject}</CardDescription>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{community.memberCount.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageSquare className="w-4 h-4" />
                        <span>{community.messageCount.toLocaleString()}</span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="w-full" onClick={() => handleJoinCommunity(community.id)}>
                      View Community
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* All Communities */}
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList>
            <TabsTrigger value="all">All Communities</TabsTrigger>
            <TabsTrigger value="my">My Communities</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              {filteredCommunities.map((community) => (
                <Card key={community.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <CardTitle className="text-lg">{community.name}</CardTitle>
                          {community.isPrivate && (
                            <Lock className="w-4 h-4 text-gray-400" />
                          )}
                          {!community.isPrivate && (
                            <Globe className="w-4 h-4 text-green-500" />
                          )}
                        </div>
                        <CardDescription >{community.description}</CardDescription>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {community.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="bg-gray-700">
                          {tag}
                        </Badge>
                      ))}
                      {community.isPremium && (
                        <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500">
                          Premium
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{community.memberCount.toLocaleString()} members</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageSquare className="w-4 h-4" />
                        <span>{community.messageCount.toLocaleString()} messages</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Avatar className="w-6 h-6">
                        <AvatarFallback className="text-xs bg-gradient-to-br from-blue-600 to-purple-600 text-white">
                          {community.creatorName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span>Created by {community.creatorName}</span>
                    </div>
                    <Button 
                      className="w-full" 
                      variant={community.isPrivate ? 'outline' : 'default'}
                      onClick={() => handleJoinCommunity(community.id)}
                    >
                      {community.isPrivate ? 'Request to Join' : 'Join Community'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="my">
            <Card >
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Users className="w-12 h-12 text-gray-400 mb-4" />
                <p className="text-gray-400 mb-4">You haven't joined any communities yet</p>
                <Button onClick={() => document.querySelector<HTMLButtonElement>('[value="all"]')?.click()}>
                  Browse Communities
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}