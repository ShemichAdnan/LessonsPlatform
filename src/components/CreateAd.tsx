import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { X, Plus } from 'lucide-react';
import type { User } from '../App';

interface CreateAdProps {
  user: User;
}

export function CreateAd({ user }: CreateAdProps) {
  const [adType, setAdType] = useState<'tutor' | 'student'>('tutor');
  const [subject, setSubject] = useState('');
  const [areas, setAreas] = useState<string[]>([]);
  const [currentArea, setCurrentArea] = useState('');
  const [level, setLevel] = useState('');
  const [pricePerHour, setPricePerHour] = useState('');
  const [location, setLocation] = useState('');
  const [city, setCity] = useState('');
  const [description, setDescription] = useState('');
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [currentTime, setCurrentTime] = useState('');

  const handleAddArea = () => {
    if (currentArea.trim() && !areas.includes(currentArea.trim())) {
      setAreas([...areas, currentArea.trim()]);
      setCurrentArea('');
    }
  };

  const handleRemoveArea = (area: string) => {
    setAreas(areas.filter((a) => a !== area));
  };

  const handleAddTime = () => {
    if (currentTime.trim() && !availableTimes.includes(currentTime.trim())) {
      setAvailableTimes([...availableTimes, currentTime.trim()]);
      setCurrentTime('');
    }
  };

  const handleRemoveTime = (time: string) => {
    setAvailableTimes(availableTimes.filter((t) => t !== time));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock submission
    alert('Ad created successfully! (This is a demo)');
    // Reset form
    setSubject('');
    setAreas([]);
    setLevel('');
    setPricePerHour('');
    setLocation('');
    setCity('');
    setDescription('');
    setAvailableTimes([]);
  };

  return (
    <div className="h-full overflow-auto bg-gray-900 overflow-scroll no-scrollbar">
      <div className="max-w-3xl mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl mb-2">Create an Ad</h1>
          <p className="text-gray-400">
            {adType === 'tutor' 
              ? 'Let students know about your tutoring services' 
              : 'Describe what kind of tutor you are looking for'}
          </p>
        </div>

        <Card className='bg-gradient-to-br from-gray-800  to-gray-900 border-gray-700'>
          <CardHeader>
            <CardTitle >Ad Details</CardTitle>
            <CardDescription >Fill in the information about your {adType === 'tutor' ? 'offering' : 'request'}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Ad Type */}
              <div className="space-y-2">
                <Label>I want to...</Label>
                <Select value={adType} onValueChange={(v: 'tutor' | 'student') => setAdType(v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tutor">Offer lessons (I'm a tutor)</SelectItem>
                    <SelectItem value="student">Find a tutor (I'm looking for lessons)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Subject */}
              <div className="space-y-2">
                <Label htmlFor="subject">Subject *</Label>
                <Input
                  id="subject"
                  placeholder="e.g., Mathematics, English, Programming"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                />
              </div>

              {/* Areas */}
              <div className="space-y-2">
                <Label htmlFor="areas">Specific Areas *</Label>
                <div className="flex gap-2">
                  <Input
                    id="areas"
                    placeholder="e.g., Calculus, Algebra, Statistics"
                    value={currentArea}
                    onChange={(e) => setCurrentArea(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddArea();
                      }
                    }}
                  />
                  <Button type="button" onClick={handleAddArea}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                {areas.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {areas.map((area) => (
                      <Badge key={area} variant="secondary" className="flex items-center gap-1">
                        {area}
                        <button
                          type="button"
                          onClick={() => handleRemoveArea(area)}
                          className="hover:text-red-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Level */}
              <div className="space-y-2">
                <Label htmlFor="level">Level *</Label>
                <Select value={level} onValueChange={setLevel} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Elementary">Elementary</SelectItem>
                    <SelectItem value="High School">High School</SelectItem>
                    <SelectItem value="College">College</SelectItem>
                    <SelectItem value="Professional">Professional</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Price */}
              <div className="space-y-2">
                <Label htmlFor="price">Price per Hour (USD)</Label>
                <Input
                  id="price"
                  type="number"
                  placeholder="e.g., 45"
                  value={pricePerHour}
                  onChange={(e) => setPricePerHour(e.target.value)}
                  min="0"
                />
              </div>

              {/* Available Times (for tutors) */}
              {adType === 'tutor' && (
                <div className="space-y-2">
                  <Label htmlFor="times">Available Times</Label>
                  <div className="flex gap-2">
                    <Input
                      id="times"
                      placeholder="e.g., Mon 17:00-19:00"
                      value={currentTime}
                      onChange={(e) => setCurrentTime(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddTime();
                        }
                      }}
                    />
                    <Button type="button" onClick={handleAddTime}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  {availableTimes.length > 0 && (
                    <div className="space-y-2 mt-3">
                      {availableTimes.map((time) => (
                        <Badge key={time} variant="outline" className="flex items-center gap-2 justify-between w-full">
                          {time}
                          <button
                            type="button"
                            onClick={() => handleRemoveTime(time)}
                            className="hover:text-red-600"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Location Type */}
              <div className="space-y-2">
                <Label htmlFor="location">Location Type *</Label>
                <Select value={location} onValueChange={setLocation} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select location type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="online">Online only</SelectItem>
                    <SelectItem value="in-person">In-person only</SelectItem>
                    <SelectItem value="both">Both online and in-person</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* City (if in-person) */}
              {(location === 'in-person' || location === 'both') && (
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    placeholder="e.g., New York"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                </div>
              )}

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder={
                    adType === 'tutor'
                      ? 'Describe your teaching experience, approach, and what makes you a great tutor...'
                      : 'Describe what you are looking for, your current level, and your learning goals...'
                  }
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={6}
                  required
                />
              </div>

              <Button type="submit" className="w-full bg-gradient-to-br from-blue-600 to-purple-600 cursor-pointer" size="lg">
                Create Ad
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}