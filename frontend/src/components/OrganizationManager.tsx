import { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Building,
    Plus,
    Edit,
    Trash2,
    Save,
    X,
    MapPin,
    Phone,
    Globe
} from 'lucide-react';

interface Organization {
    id: number;
    name: string;
    region: string;
    services: string[];
    contact: string;
    address: string;
    website?: string;
    is_active: boolean;
    created_at: string;
}

interface OrganizationForm {
    name: string;
    region: string;
    services: string[];
    contact: string;
    address: string;
    website: string;
}

const OrganizationManager = () => {
    const [organizations, setOrganizations] = useState<Organization[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingOrg, setEditingOrg] = useState<Organization | null>(null);
    const [formData, setFormData] = useState<OrganizationForm>({
        name: '',
        region: '',
        services: [],
        contact: '',
        address: '',
        website: ''
    });
    const [newService, setNewService] = useState('');

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

    const commonServices = [
        'Legal Aid',
        'Counseling',
        'Shelter',
        'Rights Education',
        'Advocacy',
        'Rehabilitation',
        'Community Support',
        'Training',
        'Emergency Support',
        'Medical Assistance'
    ];

    useEffect(() => {
        fetchOrganizations();
    }, []);

    const fetchOrganizations = async () => {
        try {
            const response = await axios.get('http://localhost:8000/admin/organizations');
            setOrganizations(response.data.organizations);
        } catch (error) {
            console.error('Error fetching organizations:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const addService = () => {
        if (newService.trim() && !formData.services.includes(newService.trim())) {
            setFormData(prev => ({
                ...prev,
                services: [...prev.services, newService.trim()]
            }));
            setNewService('');
        }
    };

    const removeService = (service: string) => {
        setFormData(prev => ({
            ...prev,
            services: prev.services.filter(s => s !== service)
        }));
    };

    const addCommonService = (service: string) => {
        if (!formData.services.includes(service)) {
            setFormData(prev => ({
                ...prev,
                services: [...prev.services, service]
            }));
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            region: '',
            services: [],
            contact: '',
            address: '',
            website: ''
        });
        setNewService('');
        setEditingOrg(null);
        setShowForm(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.region || !formData.contact || !formData.address || formData.services.length === 0) {
            alert('Please fill in all required fields including at least one service');
            return;
        }

        // Format website URL if provided
        let formattedWebsite = formData.website;
        if (formattedWebsite && !formattedWebsite.startsWith('http://') && !formattedWebsite.startsWith('https://')) {
            formattedWebsite = 'https://' + formattedWebsite;
        }

        try {
            const submitData = {
                ...formData,
                website: formattedWebsite
            };
            
            if (editingOrg) {
                await axios.put(`http://localhost:8000/admin/organizations/${editingOrg.id}`, submitData);
                alert('Organization updated successfully!');
            } else {
                await axios.post('http://localhost:8000/admin/organizations', submitData);
                alert('Organization created successfully!');
            }

            fetchOrganizations();
            resetForm();
        } catch (error) {
            console.error('Error saving organization:', error);
            alert('Error saving organization. Please try again.');
        }
    };

    const handleEdit = (org: Organization) => {
        setEditingOrg(org);
        setFormData({
            name: org.name,
            region: org.region,
            services: org.services,
            contact: org.contact,
            address: org.address,
            website: org.website || ''
        });
        setShowForm(true);
    };

    const handleDelete = async (orgId: number) => {
        if (!confirm('Are you sure you want to delete this organization? This action cannot be undone.')) {
            return;
        }

        try {
            await axios.delete(`http://localhost:8000/admin/organizations/${orgId}`);
            alert('Organization deleted successfully!');
            fetchOrganizations();
        } catch (error) {
            console.error('Error deleting organization:', error);
            alert('Error deleting organization. Please try again.');
        }
    };

    const toggleActive = async (org: Organization) => {
        try {
            await axios.put(`http://localhost:8000/admin/organizations/${org.id}`, {
                ...org,
                is_active: !org.is_active
            });
            fetchOrganizations();
        } catch (error) {
            console.error('Error updating organization:', error);
            alert('Error updating organization. Please try again.');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-center space-responsive-md">
                    <div className="loading-spinner w-12 h-12 mx-auto"></div>
                    <p className="text-responsive-lg text-gray-600">Loading organizations...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-responsive-lg">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="space-responsive-sm">
                    <h2 className="text-responsive-2xl lg:text-responsive-3xl font-bold text-gray-900">
                        Support Organizations
                    </h2>
                    <p className="text-gray-600 text-responsive-base">
                        Manage support organizations and their information
                    </p>
                </div>
                <button
                    onClick={() => setShowForm(true)}
                    className="btn btn-primary flex items-center"
                >
                    <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    <span className="hidden sm:inline">Add Organization</span>
                    <span className="sm:hidden">Add</span>
                </button>
            </div>

            {/* Organization Form */}
            {showForm && (
                <div className="card-large">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-responsive-xl lg:text-responsive-2xl font-semibold text-gray-900">
                            {editingOrg ? 'Edit Organization' : 'Add New Organization'}
                        </h3>
                        <button
                            onClick={resetForm}
                            className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                        >
                            <X className="w-5 h-5 sm:w-6 sm:h-6" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-responsive-lg">
                        <div className="form-grid">
                            <div className="form-section">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Organization Name *
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                    className="form-input"
                                    placeholder="Enter organization name"
                                />
                            </div>

                            <div className="form-section">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Region *
                                </label>
                                <select
                                    name="region"
                                    value={formData.region}
                                    onChange={handleInputChange}
                                    required
                                    className="form-select"
                                >
                                    <option value="">Select region</option>
                                    {regions.map((region) => (
                                        <option key={region} value={region}>{region}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="form-section">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Contact Information *
                            </label>
                            <input
                                type="text"
                                name="contact"
                                value={formData.contact}
                                onChange={handleInputChange}
                                required
                                className="form-input"
                                placeholder="Phone number or email"
                            />
                        </div>

                        <div className="form-section">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Address *
                            </label>
                            <textarea
                                name="address"
                                value={formData.address}
                                onChange={handleInputChange}
                                required
                                rows={3}
                                className="form-textarea"
                                placeholder="Enter full address"
                            />
                        </div>

                        <div className="form-section">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Website (Optional)
                            </label>
                            <input
                                type="text"
                                name="website"
                                value={formData.website}
                                onChange={handleInputChange}
                                className="form-input"
                                placeholder="https://example.com"
                            />
                        </div>

                        <div className="form-section">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Services *
                            </label>

                            {/* Common Services */}
                            <div className="mb-4 sm:mb-6">
                                <p className="text-sm text-gray-600 mb-3">Common services (click to add):</p>
                                <div className="flex flex-wrap gap-2">
                                    {commonServices.map((service) => (
                                        <button
                                            key={service}
                                            type="button"
                                            onClick={() => addCommonService(service)}
                                            disabled={formData.services.includes(service)}
                                            className={`service-tag ${formData.services.includes(service)
                                                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                                    : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                                                }`}
                                        >
                                            {service}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Custom Service Input */}
                            <div className="flex flex-col sm:flex-row gap-2 mb-4 sm:mb-6">
                                <input
                                    type="text"
                                    value={newService}
                                    onChange={(e) => setNewService(e.target.value)}
                                    placeholder="Add custom service"
                                    className="form-input flex-1"
                                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addService())}
                                />
                                <button
                                    type="button"
                                    onClick={addService}
                                    className="btn btn-secondary"
                                >
                                    Add
                                </button>
                            </div>

                            {/* Selected Services */}
                            {formData.services.length > 0 && (
                                <div className="space-responsive-sm">
                                    <p className="text-sm text-gray-600">Selected services:</p>
                                    <div className="flex flex-wrap gap-2">
                                        {formData.services.map((service) => (
                                            <span
                                                key={service}
                                                className="service-tag bg-green-100 text-green-800 flex items-center gap-2"
                                            >
                                                {service}
                                                <button
                                                    type="button"
                                                    onClick={() => removeService(service)}
                                                    className="text-green-600 hover:text-green-800"
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 justify-end">
                            <button
                                type="button"
                                onClick={resetForm}
                                className="btn btn-secondary"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="btn btn-primary"
                            >
                                <Save className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                                {editingOrg ? 'Update Organization' : 'Create Organization'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Organizations List */}
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                {organizations.length === 0 ? (
                    <div className="text-center py-12 lg:py-16">
                        <div className="max-w-md mx-auto space-responsive-md">
                            <Building className="w-16 h-16 text-gray-300 mx-auto" />
                            <h3 className="text-responsive-xl font-semibold text-gray-900">
                                No organizations
                            </h3>
                            <p className="text-gray-600 text-responsive-base">
                                Get started by creating a new support organization.
                            </p>
                            <button
                                onClick={() => setShowForm(true)}
                                className="btn btn-primary"
                            >
                                <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                                Add Organization
                            </button>
                        </div>
                    </div>
                ) : (
                    <ul className="divide-y divide-gray-200">
                        {organizations.map((org) => (
                            <li key={org.id} className="p-4 sm:p-6">
                                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                                            <div className="space-responsive-sm">
                                                <h4 className="text-responsive-lg lg:text-responsive-xl font-semibold text-gray-900">
                                                    {org.name}
                                                </h4>
                                                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-gray-500">
                                                    <span className="flex items-center">
                                                        <MapPin className="w-4 h-4 mr-1" />
                                                        {org.region}
                                                    </span>
                                                    <span className="flex items-center">
                                                        <Phone className="w-4 h-4 mr-1" />
                                                        {org.contact}
                                                    </span>
                                                    {org.website && (
                                                        <span className="flex items-center">
                                                            <Globe className="w-4 h-4 mr-1" />
                                                            <a 
                                                                href={org.website} 
                                                                target="_blank" 
                                                                rel="noopener noreferrer" 
                                                                className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
                                                            >
                                                                Website
                                                            </a>
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className={`status-badge ${org.is_active
                                                        ? 'status-active'
                                                        : 'status-inactive'
                                                    }`}>
                                                    {org.is_active ? 'Active' : 'Inactive'}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="mt-4 space-responsive-sm">
                                            <p className="text-sm text-gray-600">{org.address}</p>
                                            <div className="flex flex-wrap gap-1">
                                                {org.services.map((service) => (
                                                    <span
                                                        key={service}
                                                        className="service-tag service-tag-primary"
                                                    >
                                                        {service}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-2 lg:flex-shrink-0">
                                        <button
                                            onClick={() => handleEdit(org)}
                                            className="btn btn-secondary btn-small"
                                        >
                                            <Edit className="w-4 h-4 mr-1" />
                                            <span className="hidden sm:inline">Edit</span>
                                        </button>
                                        <button
                                            onClick={() => toggleActive(org)}
                                            className={`btn btn-small ${org.is_active
                                                    ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                                                    : 'bg-green-600 hover:bg-green-700 text-white'
                                                }`}
                                        >
                                            {org.is_active ? 'Deactivate' : 'Activate'}
                                        </button>
                                        <button
                                            onClick={() => handleDelete(org.id)}
                                            className="btn btn-small bg-red-600 hover:bg-red-700 text-white"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default OrganizationManager; 