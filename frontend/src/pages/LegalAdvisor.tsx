import { useState } from 'react';
import { MessageSquare, Send, Copy, Download } from 'lucide-react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';

const LegalAdvisor = () => {
    const [description, setDescription] = useState('');
    const [region, setRegion] = useState('');
    const [advice, setAdvice] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

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
        'Dire Dawa'
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setAdvice('');

        try {
            const response = await axios.post('http://localhost:8000/api/legal-advice', {
                description,
                region: region || null
            });

            setAdvice(response.data.advice);
        } catch (error: any) {
            console.error('Error getting legal advice:', error);
            if (error.response?.status === 503) {
                setError('AI service is currently unavailable. Please check your GEMINI_API_KEY configuration.');
            } else if (error.response?.status === 500) {
                setError('Error generating legal advice. Please try again.');
            } else if (error.code === 'ERR_NETWORK') {
                setError('Network error. Please check your connection and try again.');
            } else {
                setError('Error generating legal advice. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        alert('Legal advice copied to clipboard!');
    };

    const downloadAdvice = (text: string) => {
        const blob = new Blob([text], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'legal-advice.txt';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    };

    return (
        <div className="py-10">
            <div className="max-w-4xl mx-auto px-5">
                <div className="text-center mb-10">
                    <MessageSquare className="w-12 h-12 text-primary-500 mb-4 mx-auto" />
                    <h1 className="text-4xl font-bold text-gray-900 mb-3">AI Legal Advisor</h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Get personalized legal advice based on Ethiopian law and women's rights.
                        Our AI will analyze your situation and provide actionable guidance.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Input Form */}
                    <div className="card">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Describe Your Situation</h2>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                                    Case Description *
                                </label>
                                <textarea
                                    id="description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    required
                                    rows={8}
                                    className="form-textarea w-full"
                                    placeholder="Describe your legal situation in detail. Include relevant facts, dates, and any specific questions you have..."
                                />
                            </div>

                            <div>
                                <label htmlFor="region" className="block text-sm font-medium text-gray-700 mb-2">
                                    Region (Optional)
                                </label>
                                <select
                                    id="region"
                                    value={region}
                                    onChange={(e) => setRegion(e.target.value)}
                                    className="form-select w-full"
                                >
                                    <option value="">Select a region</option>
                                    {regions.map((region) => (
                                        <option key={region} value={region}>{region}</option>
                                    ))}
                                </select>
                            </div>

                            <button
                                type="submit"
                                disabled={loading || !description.trim()}
                                className="btn btn-primary w-full"
                            >
                                {loading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        Getting Legal Advice...
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-4 h-4 mr-2" />
                                        Get Legal Advice
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

                    {/* AI Response */}
                    <div className="card">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Legal Advice</h2>

                        {advice ? (
                            <div className="space-y-4">
                                <div className="bg-white p-4 rounded-lg border border-gray-200 prose prose-sm max-w-none text-gray-900 leading-relaxed min-h-[300px]">
                                    <ReactMarkdown>
                                        {advice}
                                    </ReactMarkdown>
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        onClick={() => copyToClipboard(advice)}
                                        className="btn btn-secondary btn-small"
                                    >
                                        <Copy className="w-4 h-4" />
                                        Copy
                                    </button>
                                    <button
                                        onClick={() => downloadAdvice(advice)}
                                        className="btn btn-secondary btn-small"
                                    >
                                        <Download className="w-4 h-4" />
                                        Download
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No advice generated yet</h3>
                                <p className="text-gray-600">
                                    Describe your legal situation and click "Get Legal Advice" to receive personalized guidance.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LegalAdvisor; 