import { useState } from 'react';
import { MessageCircle, Send, Heart, Shield } from 'lucide-react';
import axios from 'axios';

interface StoryWallProps {
    setIsLoading: (loading: boolean) => void;
}

const StoryWall = ({ setIsLoading }: StoryWallProps) => {
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        category: '',
        region: ''
    });
    const [isSubmitted, setIsSubmitted] = useState(false);

    const categories = [
        'domestic_violence',
        'workplace_discrimination',
        'property_rights',
        'inheritance_dispute',
        'child_custody',
        'marital_rights',
        'other'
    ];

    const regions = [
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
        'Dire Dawa',
        'Other'
    ];

    const categoryLabels = {
        domestic_violence: 'Domestic Violence',
        workplace_discrimination: 'Workplace Discrimination',
        property_rights: 'Property Rights',
        inheritance_dispute: 'Inheritance Dispute',
        child_custody: 'Child Custody',
        marital_rights: 'Marital Rights',
        other: 'Other'
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title || !formData.content || !formData.category) {
            alert('Please fill in all required fields');
            return;
        }

        setIsLoading(true);
        try {
            await axios.post('http://localhost:8000/api/submit-story', formData);
            setIsSubmitted(true);
            setFormData({ title: '', content: '', category: '', region: '' });
            setShowForm(false);
        } catch (error) {
            console.error('Error submitting story:', error);
            alert('Error submitting story. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="py-10">
            <div className="max-w-4xl mx-auto px-5">
                <div className="text-center mb-10 py-10">
                    <MessageCircle className="w-12 h-12 text-primary-500 mb-4 mx-auto" />
                    <h1 className="text-4xl font-bold text-gray-900 mb-3">Story Wall</h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">Share your experiences anonymously and connect with others</p>
                </div>

                <div className="space-y-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="card text-center">
                            <Shield className="w-12 h-12 text-primary-500 mb-4 mx-auto" />
                            <h3 className="text-xl font-semibold mb-3 text-gray-900">Anonymous & Safe</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Share your story completely anonymously. Your privacy and safety are our top priority.
                                All stories are moderated to ensure a supportive environment.
                            </p>
                        </div>

                        <div className="card text-center">
                            <Heart className="w-12 h-12 text-primary-500 mb-4 mx-auto" />
                            <h3 className="text-xl font-semibold mb-3 text-gray-900">Support Community</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Your story can inspire and help other women facing similar challenges.
                                Together, we create a community of strength and solidarity.
                            </p>
                        </div>
                    </div>

                    {!showForm && !isSubmitted && (
                        <div className="card text-center">
                            <h2 className="text-3xl font-bold mb-4 text-gray-900">Share Your Story</h2>
                            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                                Your experience matters. Share your story to help others and find support
                                from women who understand what you've been through.
                            </p>
                            <button
                                onClick={() => setShowForm(true)}
                                className="btn btn-primary btn-large"
                            >
                                <MessageCircle className="w-5 h-5" />
                                Share Your Story
                            </button>
                        </div>
                    )}

                    {showForm && (
                        <div className="card">
                            <h2 className="text-2xl font-bold mb-6 text-gray-900">Share Your Story</h2>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label htmlFor="title" className="block font-medium text-gray-900 mb-2">Story Title *</label>
                                    <input
                                        type="text"
                                        id="title"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        placeholder="Give your story a meaningful title"
                                        className="form-input"
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="category" className="block font-medium text-gray-900 mb-2">Category *</label>
                                        <select
                                            id="category"
                                            name="category"
                                            value={formData.category}
                                            onChange={handleInputChange}
                                            className="form-select"
                                            required
                                        >
                                            <option value="">Select category</option>
                                            {categories.map((category) => (
                                                <option key={category} value={category}>
                                                    {categoryLabels[category as keyof typeof categoryLabels]}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label htmlFor="region" className="block font-medium text-gray-900 mb-2">Region (Optional)</label>
                                        <select
                                            id="region"
                                            name="region"
                                            value={formData.region}
                                            onChange={handleInputChange}
                                            className="form-select"
                                        >
                                            <option value="">Select region</option>
                                            {regions.map((region) => (
                                                <option key={region} value={region}>{region}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="content" className="block font-medium text-gray-900 mb-2">Your Story *</label>
                                    <textarea
                                        id="content"
                                        name="content"
                                        value={formData.content}
                                        onChange={handleInputChange}
                                        placeholder="Share your experience, what happened, how you coped, and any advice you have for others..."
                                        className="form-textarea"
                                        rows={8}
                                        required
                                    />
                                </div>

                                <div className="flex gap-4 justify-end">
                                    <button
                                        type="button"
                                        onClick={() => setShowForm(false)}
                                        className="btn btn-secondary"
                                    >
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn btn-primary">
                                        <Send className="w-5 h-5" />
                                        Submit Story
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {isSubmitted && (
                        <div className="card text-center">
                            <Heart className="w-12 h-12 text-green-500 mb-4 mx-auto" />
                            <h3 className="text-2xl font-bold mb-3 text-gray-900">Thank You for Sharing</h3>
                            <p className="text-gray-600 mb-6 leading-relaxed">
                                Your story has been submitted successfully. It will be reviewed and posted
                                to help other women in similar situations. Your courage inspires us all.
                            </p>
                            <button
                                onClick={() => setIsSubmitted(false)}
                                className="btn btn-primary"
                            >
                                Share Another Story
                            </button>
                        </div>
                    )}

                    <div className="card">
                        <h3 className="text-xl font-bold mb-4 text-gray-900">Community Guidelines</h3>
                        <ul className="space-y-2">
                            <li className="text-gray-600">• Share your story respectfully and honestly</li>
                            <li className="text-gray-600">• Focus on your experience and how you overcame challenges</li>
                            <li className="text-gray-600">• Avoid sharing identifying information about others</li>
                            <li className="text-gray-600">• Be supportive and encouraging to others</li>
                            <li className="text-gray-600">• All stories are moderated before being posted</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StoryWall; 