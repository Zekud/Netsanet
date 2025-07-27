import { useState, useEffect } from 'react';
import { Users, Phone, MapPin, Globe, Filter, AlertTriangle } from 'lucide-react';
import axios from 'axios';

interface Organization {
    name: string;
    region: string;
    services: string[];
    contact: string;
    address: string;
    website: string;
}

const SupportDirectory = () => {
    const [organizations, setOrganizations] = useState<Organization[]>([]);
    const [filteredOrgs, setFilteredOrgs] = useState<Organization[]>([]);
    const [selectedRegion, setSelectedRegion] = useState('');
    const [loading, setLoading] = useState(true);

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

    useEffect(() => {
        fetchOrganizations();
    }, []);

    useEffect(() => {
        if (selectedRegion === 'All Regions' || selectedRegion === '') {
            setFilteredOrgs(organizations);
        } else {
            setFilteredOrgs(organizations.filter(org => org.region === selectedRegion));
        }
    }, [selectedRegion, organizations]);

    const fetchOrganizations = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/support-organizations');
            setOrganizations(response.data.organizations);
            setFilteredOrgs(response.data.organizations);
        } catch (error) {
            console.error('Error fetching organizations:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="section-padding">
                <div className="container-responsive">
                    <div className="flex items-center justify-center py-12">
                        <div className="text-center space-responsive-md">
                            <div className="loading-spinner w-12 h-12 mx-auto"></div>
                            <p className="text-responsive-lg text-gray-600">Loading support organizations...</p>
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
                    <Users className="page-icon mx-auto" />
                    <h1 className="text-responsive-3xl lg:text-responsive-4xl font-bold text-gray-900 mb-4">
                        Support Directory
                    </h1>
                    <p className="text-responsive-lg text-gray-600 max-w-3xl mx-auto">
                        Find legal aid organizations and support services in your region. Connect with professionals who can help you navigate your legal journey.
                    </p>
                </div>

                {/* Filter Bar */}
                <div className="filter-bar mb-8 lg:mb-12">
                    <div className="filter-group">
                        <div className="flex items-center gap-2 sm:gap-3">
                            <Filter className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
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
                        {filteredOrgs.length} organization{filteredOrgs.length !== 1 ? 's' : ''} found
                    </p>
                </div>

                {/* Organizations Grid */}
                <div className="grid-responsive-3 gap-6 lg:gap-8">
                    {filteredOrgs.map((org, index) => (
                        <div key={index} className="org-card group hover:-translate-y-1 transition-all duration-300">
                            <div className="space-responsive-sm">
                                <div className="flex justify-between items-start gap-4">
                                    <h3 className="text-responsive-lg lg:text-responsive-xl font-semibold text-gray-900 leading-tight group-hover:text-primary-600 transition-colors duration-300">
                                        {org.name}
                                    </h3>
                                    <span className="service-tag bg-primary-100 text-primary-800 flex-shrink-0">
                                        {org.region}
                                    </span>
                                </div>

                                <div className="space-responsive-sm">
                                    <h4 className="font-medium text-gray-900 text-responsive-base">Services Offered:</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {org.services.map((service, serviceIndex) => (
                                            <span key={serviceIndex} className="service-tag service-tag-secondary">
                                                {service}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="space-responsive-sm mt-4 sm:mt-6">
                                <div className="flex items-start gap-3 text-gray-600">
                                    <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-primary-500 flex-shrink-0 mt-0.5" />
                                    <span className="text-responsive-sm">{org.contact}</span>
                                </div>
                                <div className="flex items-start gap-3 text-gray-600">
                                    <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-primary-500 flex-shrink-0 mt-0.5" />
                                    <span className="text-responsive-sm">{org.address}</span>
                                </div>
                                {org.website && (
                                    <div className="flex items-start gap-3">
                                        <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-primary-500 flex-shrink-0 mt-0.5" />
                                        <a 
                                            href={`https://${org.website}`} 
                                            target="_blank" 
                                            rel="noopener noreferrer" 
                                            className="text-primary-500 hover:text-primary-700 hover:underline text-responsive-sm transition-colors duration-200"
                                        >
                                            {org.website}
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Empty State */}
                {filteredOrgs.length === 0 && (
                    <div className="text-center py-12 lg:py-16">
                        <div className="max-w-md mx-auto space-responsive-md">
                            <Users className="w-16 h-16 text-gray-300 mx-auto" />
                            <h3 className="text-responsive-xl font-semibold text-gray-900">
                                No organizations found
                            </h3>
                            <p className="text-gray-600 text-responsive-base">
                                Try selecting a different region or contact us for assistance.
                            </p>
                        </div>
                    </div>
                )}

                {/* Emergency Contacts Section */}
                <div className="card-large mt-12 lg:mt-16">
                    <div className="text-center mb-8 lg:mb-12">
                        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                        <h3 className="text-responsive-2xl lg:text-responsive-3xl font-bold text-gray-900 mb-4">
                            Emergency Contacts
                        </h3>
                        <p className="text-gray-600 text-responsive-lg max-w-2xl mx-auto">
                            If you're in immediate danger or need urgent assistance, contact these emergency services
                        </p>
                    </div>
                    
                    <div className="grid-responsive-3 gap-6 lg:gap-8">
                        <div className="text-center p-6 sm:p-8 bg-red-50 rounded-xl border border-red-200">
                            <h4 className="font-semibold text-gray-900 mb-3 text-responsive-lg">Police Emergency</h4>
                            <p className="text-red-600 font-bold text-responsive-xl lg:text-responsive-2xl">911</p>
                            <p className="text-gray-600 text-responsive-sm mt-2">24/7 Emergency Response</p>
                        </div>
                        
                        <div className="text-center p-6 sm:p-8 bg-primary-50 rounded-xl border border-primary-200">
                            <h4 className="font-semibold text-gray-900 mb-3 text-responsive-lg">Women's Helpline</h4>
                            <p className="text-primary-600 font-bold text-responsive-xl lg:text-responsive-2xl">+251 11 123 4567</p>
                            <p className="text-gray-600 text-responsive-sm mt-2">Specialized Support</p>
                        </div>
                        
                        <div className="text-center p-6 sm:p-8 bg-green-50 rounded-xl border border-green-200">
                            <h4 className="font-semibold text-gray-900 mb-3 text-responsive-lg">Legal Aid Hotline</h4>
                            <p className="text-green-600 font-bold text-responsive-xl lg:text-responsive-2xl">+251 11 987 6543</p>
                            <p className="text-gray-600 text-responsive-sm mt-2">Free Legal Advice</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SupportDirectory; 