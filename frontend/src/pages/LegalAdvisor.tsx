import { useState } from 'react';
import { Scale, Send, Copy, Download } from 'lucide-react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';

interface LegalAdvisorProps {
    setIsLoading: (loading: boolean) => void;
}

const LegalAdvisor = ({ setIsLoading }: LegalAdvisorProps) => {
    const [caseDescription, setCaseDescription] = useState('');
    const [region, setRegion] = useState('');
    const [legalAdvice, setLegalAdvice] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);

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
        if (!caseDescription.trim()) return;

        setIsLoading(true);
        try {
            const response = await axios.post('http://localhost:8000/api/legal-advice', {
                description: caseDescription,
                region: region || undefined
            });

            setLegalAdvice(response.data.advice);
            setIsSubmitted(true);
        } catch (error) {
            console.error('Error getting legal advice:', error);
            alert('Error getting legal advice. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(legalAdvice);
        alert('Legal advice copied to clipboard!');
    };

    const downloadAdvice = () => {
        const blob = new Blob([legalAdvice], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'legal-advice.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="py-10">
            <div className="max-w-7xl mx-auto px-5">
                <div className="text-center mb-10 py-10">
                    <Scale className="w-12 h-12 text-primary-500 mb-4 mx-auto" />
                    <h1 className="text-4xl font-bold text-gray-900 mb-3">AI Legal Advisor</h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">Get personalized legal guidance based on Ethiopian law and your specific situation</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-10">
                    <div className="card">
                        <h2 className="text-2xl font-bold mb-6 text-gray-900">Describe Your Situation</h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="region" className="block font-medium text-gray-900 mb-2">Region (Optional)</label>
                                <select
                                    id="region"
                                    value={region}
                                    onChange={(e) => setRegion(e.target.value)}
                                    className="form-select"
                                >
                                    <option value="">Select your region</option>
                                    {regions.map((r) => (
                                        <option key={r} value={r}>{r}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label htmlFor="case-description" className="block font-medium text-gray-900 mb-2">Case Description</label>
                                <textarea
                                    id="case-description"
                                    value={caseDescription}
                                    onChange={(e) => setCaseDescription(e.target.value)}
                                    placeholder="Please describe your situation in detail. Include relevant dates, locations, and any evidence you may have..."
                                    className="form-textarea"
                                    rows={8}
                                    required
                                />
                            </div>

                            <button type="submit" className="btn btn-primary">
                                <Send className="w-5 h-5" />
                                Get Legal Advice
                            </button>
                        </form>
                    </div>

                    {isSubmitted && legalAdvice && (
                        <div className="card">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-900">Your Legal Advice</h2>
                                <div className="flex gap-3">
                                    <button onClick={copyToClipboard} className="btn btn-secondary btn-small">
                                        <Copy className="w-4 h-4" />
                                        Copy
                                    </button>
                                    <button onClick={downloadAdvice} className="btn btn-secondary btn-small">
                                        <Download className="w-4 h-4" />
                                        Download
                                    </button>
                                </div>
                            </div>
                            <div className="bg-gray-50 p-5 rounded-lg border border-gray-200 prose prose-sm max-w-none text-gray-900 leading-relaxed">
                                <ReactMarkdown>
                                    {legalAdvice}
                                </ReactMarkdown>
                            </div>
                        </div>
                    )}
                </div>

                <div className="card border-l-4 border-orange-500">
                    <h3 className="text-xl font-bold mb-3 text-gray-900">Important Disclaimer</h3>
                    <p className="text-gray-600 leading-relaxed">
                        This AI-powered legal advice is for informational purposes only and should not be considered
                        as formal legal counsel. For specific legal matters, please consult with a qualified lawyer
                        or legal professional. The advice provided is based on general Ethiopian legal principles
                        and may not apply to your specific situation.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LegalAdvisor; 