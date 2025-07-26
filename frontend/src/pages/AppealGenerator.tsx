import { useState } from 'react';
import { FileText, Send, Copy, Download, Edit, Eye } from 'lucide-react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';

const AppealGenerator = () => {
    const [formData, setFormData] = useState({
        name: '',
        case_type: '',
        incident_date: '',
        location: '',
        description: '',
        evidence: '',
        contact_info: ''
    });
    const [englishLetter, setEnglishLetter] = useState('');
    const [amharicLetter, setAmharicLetter] = useState('');
    const [isGenerated, setIsGenerated] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [editMode, setEditMode] = useState<'english' | 'amharic' | null>(null);

    const caseTypes = [
        'domestic_violence',
        'workplace_discrimination',
        'property_rights',
        'inheritance_dispute',
        'child_custody',
        'marital_rights'
    ];

    const caseTypeLabels = {
        domestic_violence: 'Domestic Violence',
        workplace_discrimination: 'Workplace Discrimination',
        property_rights: 'Property Rights',
        inheritance_dispute: 'Inheritance Dispute',
        child_custody: 'Child Custody',
        marital_rights: 'Marital Rights'
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
        setLoading(true);
        setError('');
        setIsGenerated(false);

        try {
            const response = await axios.post('http://localhost:8000/api/generate-appeal', formData);

            // Parse the response to separate English and Amharic versions
            const appealText = response.data.appeal_letter;

            // Extract English version
            const englishMatch = appealText.match(/English Version:?\s*([\s\S]*?)(?=Amharic Version:|$)/i);
            const english = englishMatch ? englishMatch[1].trim() : appealText;

            // Extract Amharic version
            const amharicMatch = appealText.match(/Amharic Version:?\s*([\s\S]*?)(?=English Version:|$)/i);
            const amharic = amharicMatch ? amharicMatch[1].trim() : '';

            setEnglishLetter(english);
            setAmharicLetter(amharic);
            setIsGenerated(true);
        } catch (error: any) {
            console.error('Error generating appeal letter:', error);
            if (error.response?.status === 503) {
                setError('AI service is currently unavailable. Please check your GEMINI_API_KEY configuration.');
            } else if (error.response?.status === 500) {
                setError('Error generating appeal letter. Please try again.');
            } else if (error.code === 'ERR_NETWORK') {
                setError('Network error. Please check your connection and try again.');
            } else {
                setError('Error generating appeal letter. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const stripMarkdown = (text: string): string => {
        return text
            .replace(/^#{1,6}\s+/gm, '')
            .replace(/\*\*(.*?)\*\*/g, '$1')
            .replace(/\*(.*?)\*/g, '$1')
            .replace(/__(.*?)__/g, '$1')
            .replace(/_(.*?)_/g, '$1')
            .replace(/```[\s\S]*?```/g, '')
            .replace(/`([^`]+)`/g, '$1')
            .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
            .replace(/^[\s]*[-*+]\s+/gm, '')
            .replace(/^[\s]*\d+\.\s+/gm, '')
            .replace(/^>\s+/gm, '')
            .replace(/\n\s*\n\s*\n/g, '\n\n')
            .trim();
    };

    const copyToClipboard = (text: string, language: string) => {
        const cleanText = stripMarkdown(text);
        navigator.clipboard.writeText(cleanText);
        alert(`${language} letter copied to clipboard!`);
    };

    const downloadLetter = (text: string, language: string) => {
        const cleanText = stripMarkdown(text);
        const blob = new Blob([cleanText], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `appeal-letter-${language.toLowerCase()}.txt`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    };

    const toggleEditMode = (language: 'english' | 'amharic') => {
        setEditMode(editMode === language ? null : language);
    };

    const renderLetterContent = (content: string, language: string) => {
        const isEditing = editMode === language;
        return (
            <div className="relative">
                {isEditing ? (
                    <textarea
                        value={content}
                        onChange={(e) => {
                            if (language === 'english') {
                                setEnglishLetter(e.target.value);
                            } else {
                                setAmharicLetter(e.target.value);
                            }
                        }}
                        className="form-textarea font-mono text-sm"
                        rows={15}
                        placeholder={`${language} appeal letter will appear here...`}
                    />
                ) : (
                    <div className="bg-white p-4 rounded-lg border border-gray-200 prose prose-sm max-w-none text-gray-900 leading-relaxed min-h-[300px]">
                        <ReactMarkdown>
                            {content || `No ${language} content available`}
                        </ReactMarkdown>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="py-10">
            <div className="max-w-7xl mx-auto px-5">
                <div className="text-center mb-10">
                    <FileText className="w-12 h-12 text-primary-500 mb-4 mx-auto" />
                    <h1 className="text-4xl font-bold text-gray-900 mb-3">Appeal Letter Generator</h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Generate formal appeal letters in both English and Amharic for your legal case.
                        Our AI will create professional, legally-sound documents based on your situation.
                    </p>
                </div>

                {!isGenerated ? (
                    <div className="max-w-2xl mx-auto">
                        <div className="card">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Case Information</h2>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                            Full Name *
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            required
                                            className="form-input w-full"
                                            placeholder="Your full name"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="case_type" className="block text-sm font-medium text-gray-700 mb-2">
                                            Case Type *
                                        </label>
                                        <select
                                            id="case_type"
                                            name="case_type"
                                            value={formData.case_type}
                                            onChange={handleInputChange}
                                            required
                                            className="form-select w-full"
                                        >
                                            <option value="">Select case type</option>
                                            {caseTypes.map((type) => (
                                                <option key={type} value={type}>
                                                    {caseTypeLabels[type as keyof typeof caseTypeLabels]}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="incident_date" className="block text-sm font-medium text-gray-700 mb-2">
                                            Incident Date *
                                        </label>
                                        <input
                                            type="text"
                                            id="incident_date"
                                            name="incident_date"
                                            value={formData.incident_date}
                                            onChange={handleInputChange}
                                            required
                                            className="form-input w-full"
                                            placeholder="e.g., January 15, 2024"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                                            Location *
                                        </label>
                                        <input
                                            type="text"
                                            id="location"
                                            name="location"
                                            value={formData.location}
                                            onChange={handleInputChange}
                                            required
                                            className="form-input w-full"
                                            placeholder="City, Region"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                                        Case Description *
                                    </label>
                                    <textarea
                                        id="description"
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        required
                                        rows={6}
                                        className="form-textarea w-full"
                                        placeholder="Describe your case in detail. Include what happened, when, where, and any relevant facts..."
                                    />
                                </div>

                                <div>
                                    <label htmlFor="evidence" className="block text-sm font-medium text-gray-700 mb-2">
                                        Evidence (Optional)
                                    </label>
                                    <textarea
                                        id="evidence"
                                        name="evidence"
                                        value={formData.evidence}
                                        onChange={handleInputChange}
                                        rows={4}
                                        className="form-textarea w-full"
                                        placeholder="List any evidence you have (documents, witnesses, photos, etc.)"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="contact_info" className="block text-sm font-medium text-gray-700 mb-2">
                                        Contact Information *
                                    </label>
                                    <input
                                        type="text"
                                        id="contact_info"
                                        name="contact_info"
                                        value={formData.contact_info}
                                        onChange={handleInputChange}
                                        required
                                        className="form-input w-full"
                                        placeholder="Phone number, email, or address"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading || !formData.name || !formData.case_type || !formData.incident_date || !formData.location || !formData.description || !formData.contact_info}
                                    className="btn btn-primary w-full"
                                >
                                    {loading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                            Generating Appeal Letter...
                                        </>
                                    ) : (
                                        <>
                                            <Send className="w-4 h-4 mr-2" />
                                            Generate Appeal Letter
                                        </>
                                    )}
                                </button>
                            </form>

                            {error && (
                                <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                                    {error}
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* English Version */}
                        <div className="card">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-bold text-gray-900">English Version</h3>
                                <div className="flex gap-2">
                                    <button onClick={() => toggleEditMode('english')} className="btn btn-secondary btn-small">
                                        {editMode === 'english' ? (<><Eye className="w-4 h-4" />View</>) : (<><Edit className="w-4 h-4" />Edit</>)}
                                    </button>
                                    <button onClick={() => copyToClipboard(englishLetter, 'English')} className="btn btn-secondary btn-small">
                                        <Copy className="w-4 h-4" />Copy
                                    </button>
                                    <button onClick={() => downloadLetter(englishLetter, 'English')} className="btn btn-secondary btn-small">
                                        <Download className="w-4 h-4" />Download
                                    </button>
                                </div>
                            </div>
                            {renderLetterContent(englishLetter, 'english')}
                        </div>

                        {/* Amharic Version */}
                        <div className="card">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-bold text-gray-900">Amharic Version</h3>
                                <div className="flex gap-2">
                                    <button onClick={() => toggleEditMode('amharic')} className="btn btn-secondary btn-small">
                                        {editMode === 'amharic' ? (<><Eye className="w-4 h-4" />View</>) : (<><Edit className="w-4 h-4" />Edit</>)}
                                    </button>
                                    <button onClick={() => copyToClipboard(amharicLetter, 'Amharic')} className="btn btn-secondary btn-small">
                                        <Copy className="w-4 h-4" />Copy
                                    </button>
                                    <button onClick={() => downloadLetter(amharicLetter, 'Amharic')} className="btn btn-secondary btn-small">
                                        <Download className="w-4 h-4" />Download
                                    </button>
                                </div>
                            </div>
                            {renderLetterContent(amharicLetter, 'amharic')}
                        </div>

                        <div className="text-center">
                            <button
                                onClick={() => {
                                    setIsGenerated(false);
                                    setEnglishLetter('');
                                    setAmharicLetter('');
                                    setEditMode(null);
                                }}
                                className="btn btn-primary"
                            >
                                Generate Another Letter
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AppealGenerator; 