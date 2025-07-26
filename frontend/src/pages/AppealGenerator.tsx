import { useState } from 'react';
import { FileText, Send, Copy, Download } from 'lucide-react';
import axios from 'axios';

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
    const [appealLetter, setAppealLetter] = useState('');
    const [isGenerated, setIsGenerated] = useState(false);

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
            setAppealLetter(response.data.appeal_letter);
            setIsGenerated(true);
        } catch (error) {
            console.error('Error generating appeal letter:', error);
            alert('Error generating appeal letter. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(appealLetter);
        alert('Appeal letter copied to clipboard!');
    };

    const downloadLetter = () => {
        const blob = new Blob([appealLetter], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `appeal-letter-${formData.name.replace(/\s+/g, '-')}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
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

                    {isGenerated && appealLetter && (
                        <div className="card">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-900">Your Appeal Letter</h2>
                                <div className="flex gap-3">
                                    <button onClick={copyToClipboard} className="btn btn-secondary btn-small">
                                        <Copy className="w-4 h-4" />
                                        Copy
                                    </button>
                                    <button onClick={downloadLetter} className="btn btn-secondary btn-small">
                                        <Download className="w-4 h-4" />
                                        Download
                                    </button>
                                </div>
                            </div>
                            <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
                                <pre className="whitespace-pre-wrap font-mono text-sm text-gray-900 leading-relaxed">{appealLetter}</pre>
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