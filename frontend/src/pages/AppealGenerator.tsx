import { useState } from 'react';
import { FileText, Send, Copy, Download, Edit, Eye } from 'lucide-react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';

interface AppealGeneratorProps {
    setIsLoading: (loading: boolean) => void;
}

const AppealGenerator = ({ setIsLoading }: AppealGeneratorProps) => {
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
    const [editMode, setEditMode] = useState<'english' | 'amharic' | null>(null);

    const caseTypes = [
        'Domestic Violence',
        'Workplace Discrimination',
        'Property Rights',
        'Inheritance Dispute',
        'Child Custody',
        'Marital Rights',
        'Educational Discrimination',
        'Healthcare Discrimination',
        'Other'
    ];

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.case_type || !formData.description) {
            alert('Please fill in all required fields');
            return;
        }

        setIsLoading(true);
        try {
            const response = await axios.post('http://localhost:8000/api/generate-appeal', formData);

            // Parse the response to separate English and Amharic versions
            const content = response.data.appeal_letter;

            // Split by language markers if they exist
            const englishMatch = content.match(/English Version:?\s*([\s\S]*?)(?=Amharic Version:|$)/i);
            const amharicMatch = content.match(/Amharic Version:?\s*([\s\S]*?)(?=English Version:|$)/i);

            if (englishMatch && amharicMatch) {
                setEnglishLetter(englishMatch[1].trim());
                setAmharicLetter(amharicMatch[1].trim());
            } else {
                // If no clear separation, assume it's all English
                setEnglishLetter(content.trim());
                setAmharicLetter('');
            }

            setIsGenerated(true);
        } catch (error) {
            console.error('Error generating appeal letter:', error);
            alert('Error generating appeal letter. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const stripMarkdown = (text: string): string => {
        return text
            // Remove headers
            .replace(/^#{1,6}\s+/gm, '')
            // Remove bold/italic
            .replace(/\*\*(.*?)\*\*/g, '$1')
            .replace(/\*(.*?)\*/g, '$1')
            .replace(/__(.*?)__/g, '$1')
            .replace(/_(.*?)_/g, '$1')
            // Remove code blocks
            .replace(/```[\s\S]*?```/g, '')
            .replace(/`([^`]+)`/g, '$1')
            // Remove links
            .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
            // Remove list markers
            .replace(/^[\s]*[-*+]\s+/gm, '')
            .replace(/^[\s]*\d+\.\s+/gm, '')
            // Remove blockquotes
            .replace(/^>\s+/gm, '')
            // Clean up extra whitespace
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
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `appeal-letter-${language}-${formData.name.replace(/\s+/g, '-')}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
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
                <div className="text-center mb-10 py-10">
                    <FileText className="w-12 h-12 text-primary-500 mb-4 mx-auto" />
                    <h1 className="text-4xl font-bold text-gray-900 mb-3">Appeal Letter Generator</h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">Generate formal appeal letters in both Amharic and English for your case</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-10">
                    <div className="card">
                        <h2 className="text-2xl font-bold mb-6 text-gray-900">Case Information</h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="name" className="block font-medium text-gray-900 mb-2">Full Name *</label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="form-input"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="case_type" className="block font-medium text-gray-900 mb-2">Case Type *</label>
                                    <select
                                        id="case_type"
                                        name="case_type"
                                        value={formData.case_type}
                                        onChange={handleInputChange}
                                        className="form-select"
                                        required
                                    >
                                        <option value="">Select case type</option>
                                        {caseTypes.map((type) => (
                                            <option key={type} value={type}>{type}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="incident_date" className="block font-medium text-gray-900 mb-2">Incident Date *</label>
                                    <input
                                        type="date"
                                        id="incident_date"
                                        name="incident_date"
                                        value={formData.incident_date}
                                        onChange={handleInputChange}
                                        className="form-input"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="location" className="block font-medium text-gray-900 mb-2">Location *</label>
                                    <input
                                        type="text"
                                        id="location"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleInputChange}
                                        placeholder="City, Region"
                                        className="form-input"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="description" className="block font-medium text-gray-900 mb-2">Case Description *</label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    placeholder="Please provide a detailed description of your case, including what happened, who was involved, and any relevant details..."
                                    className="form-textarea"
                                    rows={6}
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="evidence" className="block font-medium text-gray-900 mb-2">Evidence (Optional)</label>
                                <textarea
                                    id="evidence"
                                    name="evidence"
                                    value={formData.evidence}
                                    onChange={handleInputChange}
                                    placeholder="Describe any evidence you have (documents, witnesses, photos, etc.)"
                                    className="form-textarea"
                                    rows={3}
                                />
                            </div>

                            <div>
                                <label htmlFor="contact_info" className="block font-medium text-gray-900 mb-2">Contact Information *</label>
                                <input
                                    type="text"
                                    id="contact_info"
                                    name="contact_info"
                                    value={formData.contact_info}
                                    onChange={handleInputChange}
                                    placeholder="Phone number, email, or address"
                                    className="form-input"
                                    required
                                />
                            </div>

                            <button type="submit" className="btn btn-primary">
                                <Send className="w-5 h-5" />
                                Generate Appeal Letter
                            </button>
                        </form>
                    </div>

                    {isGenerated && (
                        <div className="space-y-6">
                            {/* English Version */}
                            <div className="card">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-xl font-bold text-gray-900">English Version</h3>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => toggleEditMode('english')}
                                            className="btn btn-secondary btn-small"
                                        >
                                            {editMode === 'english' ? (
                                                <>
                                                    <Eye className="w-4 h-4" />
                                                    View
                                                </>
                                            ) : (
                                                <>
                                                    <Edit className="w-4 h-4" />
                                                    Edit
                                                </>
                                            )}
                                        </button>
                                        <button
                                            onClick={() => copyToClipboard(englishLetter, 'English')}
                                            className="btn btn-secondary btn-small"
                                        >
                                            <Copy className="w-4 h-4" />
                                            Copy
                                        </button>
                                        <button
                                            onClick={() => downloadLetter(englishLetter, 'English')}
                                            className="btn btn-secondary btn-small"
                                        >
                                            <Download className="w-4 h-4" />
                                            Download
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
                                        <button
                                            onClick={() => toggleEditMode('amharic')}
                                            className="btn btn-secondary btn-small"
                                        >
                                            {editMode === 'amharic' ? (
                                                <>
                                                    <Eye className="w-4 h-4" />
                                                    View
                                                </>
                                            ) : (
                                                <>
                                                    <Edit className="w-4 h-4" />
                                                    Edit
                                                </>
                                            )}
                                        </button>
                                        <button
                                            onClick={() => copyToClipboard(amharicLetter, 'Amharic')}
                                            className="btn btn-secondary btn-small"
                                        >
                                            <Copy className="w-4 h-4" />
                                            Copy
                                        </button>
                                        <button
                                            onClick={() => downloadLetter(amharicLetter, 'Amharic')}
                                            className="btn btn-secondary btn-small"
                                        >
                                            <Download className="w-4 h-4" />
                                            Download
                                        </button>
                                    </div>
                                </div>
                                {renderLetterContent(amharicLetter, 'amharic')}
                            </div>
                        </div>
                    )}
                </div>

                <div className="card border-l-4 border-orange-500">
                    <h3 className="text-xl font-bold mb-3 text-gray-900">Important Notes</h3>
                    <ul className="space-y-2">
                        <li className="text-gray-600">• This appeal letter is generated based on the information you provide</li>
                        <li className="text-gray-600">• Review and modify the letter as needed for your specific situation</li>
                        <li className="text-gray-600">• Consider consulting with a legal professional before submitting</li>
                        <li className="text-gray-600">• Keep copies of all documents and correspondence</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default AppealGenerator; 