import { useState, useEffect } from 'react';
import { BookOpen, Filter, Heart, CheckCircle, Clock } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

interface Story {
    id: number;
    title: string;
    content: string;
    category: string;
    region: string;
    outcome: string;
    is_approved?: boolean;
}

const CaseStories = () => {
    const { isAdmin } = useAuth();
    const [stories, setStories] = useState<Story[]>([]);
    const [filteredStories, setFilteredStories] = useState<Story[]>([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedRegion, setSelectedRegion] = useState('');
    const [loading, setLoading] = useState(true);

    const categories = [
        'All Categories',
        'domestic_violence',
        'workplace_discrimination',
        'property_rights',
        'inheritance_dispute',
        'child_custody',
        'marital_rights'
    ];

    const regions = [
        'All Regions',
        'Addis Ababa',
        'Tigray',
        'Oromia',
        'Amhara',
        'SNNPR',
        'Afar',
        'Somali',
        'Benishangul-Gumuz',
        'Gambella',
        'Harari',
        'Dire Dawa'
    ];

    const categoryLabels = {
        domestic_violence: 'Domestic Violence',
        workplace_discrimination: 'Workplace Discrimination',
        property_rights: 'Property Rights',
        inheritance_dispute: 'Inheritance Dispute',
        child_custody: 'Child Custody',
        marital_rights: 'Marital Rights'
    };

    useEffect(() => {
        fetchStories();
    }, []);

    useEffect(() => {
        let filtered = stories;

        if (selectedCategory && selectedCategory !== 'All Categories') {
            filtered = filtered.filter(story => story.category === selectedCategory);
        }

        if (selectedRegion && selectedRegion !== 'All Regions') {
            filtered = filtered.filter(story => story.region === selectedRegion);
        }

        setFilteredStories(filtered);
    }, [selectedCategory, selectedRegion, stories]);

    const fetchStories = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/case-stories');
            setStories(response.data.stories);
            setFilteredStories(response.data.stories);
        } catch (error) {
            console.error('Error fetching stories:', error);
        } finally {
            setLoading(false);
        }
    };

    const approveStory = async (storyId: number) => {
        try {
            await axios.post(`http://localhost:8000/api/approve-story/${storyId}`);
            // Refresh stories after approval
            fetchStories();
            alert('Story approved successfully!');
        } catch (error) {
            console.error('Error approving story:', error);
            alert('Error approving story. Please try again.');
        }
    };

    if (loading) {
        return (
            <div className="section-padding">
                <div className="container-responsive">
                    <div className="flex items-center justify-center py-12">
                        <div className="text-center space-responsive-md">
                            <div className="loading-spinner w-12 h-12 mx-auto"></div>
                            <p className="text-responsive-lg text-gray-600">Loading inspiring stories...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="section-padding">
            <div className="container-responsive">
                {/* Page Header */}
                <div className="page-header">
                    <BookOpen className="page-icon mx-auto" />
                    <h1 className="text-responsive-3xl lg:text-responsive-4xl font-bold text-gray-900 mb-4">
                        Case Stories
                    </h1>
                    <p className="text-responsive-lg text-gray-600 max-w-3xl mx-auto">
                        Read inspiring stories from other women who have overcome similar challenges and find strength in shared experiences
                    </p>
                </div>

                {/* Filter Bar */}
                <div className="filter-bar mb-8 lg:mb-12">
                    <div className="filter-group">
                        <div className="flex items-center gap-2 sm:gap-3">
                            <Filter className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="form-select text-responsive-sm"
                            >
                                {categories.map((category) => (
                                    <option key={category} value={category}>
                                        {category === 'All Categories' ? 'All Categories' : categoryLabels[category as keyof typeof categoryLabels]}
                                    </option>
                                ))}
                            </select>
                            <select
                                value={selectedRegion}
                                onChange={(e) => setSelectedRegion(e.target.value)}
                                className="form-select text-responsive-sm"
                            >
                                {regions.map((region) => (
                                    <option key={region} value={region}>{region}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <p className="text-responsive-sm text-gray-600 font-medium">
                        {filteredStories.length} story{filteredStories.length !== 1 ? 'ies' : 'y'} found
                    </p>
                </div>

                {/* Stories Grid */}
                <div className="grid-responsive-2 gap-6 lg:gap-8">
                    {filteredStories.map((story) => (
                        <div key={story.id} className={`story-card ${story.is_approved === false ? 'story-card-pending' : ''}`}>
                            <div className="space-responsive-sm">
                                <div className="flex justify-between items-start gap-4">
                                    <h3 className="text-responsive-xl font-semibold text-gray-900 leading-tight">
                                        {story.title}
                                    </h3>
                                    {story.is_approved === false && (
                                        <span className="status-badge status-pending flex items-center gap-1 flex-shrink-0">
                                            <Clock className="w-3 h-3" />
                                            <span className="hidden sm:inline">Pending</span>
                                        </span>
                                    )}
                                </div>
                                
                                <div className="flex flex-wrap gap-2">
                                    <span className="service-tag service-tag-secondary">
                                        {categoryLabels[story.category as keyof typeof categoryLabels]}
                                    </span>
                                    <span className="service-tag service-tag-secondary">
                                        {story.region}
                                    </span>
                                </div>
                            </div>

                            <div className="my-4 sm:my-6">
                                <p className="text-gray-600 leading-relaxed text-responsive-base">
                                    {story.content}
                                </p>
                            </div>

                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                <div className="flex items-center gap-2 text-green-600">
                                    <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
                                    <span className="font-medium text-responsive-sm">
                                        {story.outcome === 'positive' ? 'Positive Outcome' : 'Case Resolved'}
                                    </span>
                                </div>

                                {story.is_approved === false && (
                                    <button
                                        onClick={() => approveStory(story.id)}
                                        className="btn btn-primary btn-small"
                                    >
                                        <CheckCircle className="w-4 h-4" />
                                        <span className="hidden sm:inline">Approve</span>
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Empty State */}
                {filteredStories.length === 0 && (
                    <div className="text-center py-12 lg:py-16">
                        <div className="max-w-md mx-auto space-responsive-md">
                            <BookOpen className="w-16 h-16 text-gray-300 mx-auto" />
                            <h3 className="text-responsive-xl font-semibold text-gray-900">
                                No stories found
                            </h3>
                            <p className="text-gray-600 text-responsive-base">
                                Try selecting different filters or check back later for new stories.
                            </p>
                        </div>
                    </div>
                )}

                {/* Share Your Story Section - Only for non-admin users */}
                {!isAdmin && (
                    <div className="card-large text-center mt-12 lg:mt-16">
                        <h3 className="text-responsive-2xl lg:text-responsive-3xl font-bold mb-4 text-gray-900">
                            Share Your Story
                        </h3>
                        <p className="text-gray-600 mb-6 max-w-2xl mx-auto text-responsive-lg">
                            Your experience can inspire and help other women. Share your story anonymously
                            on our Story Wall to support the community.
                        </p>
                        <a href="/story-wall" className="btn btn-primary btn-large">
                            Share Your Story
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CaseStories; 