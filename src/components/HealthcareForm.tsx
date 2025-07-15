'use client';

import { useState } from 'react';
import { Plus, Trash2, Calendar, Building, Award, BookOpen, Users, Stethoscope } from 'lucide-react';
import { HealthcareData, MedicalLicense, BoardCertification, HospitalAffiliation, Publication, ClinicalExperience } from '@/types/resume';

interface HealthcareFormProps {
  healthcareData: HealthcareData;
  onHealthcareDataChange: (data: HealthcareData) => void;
}

export function HealthcareForm({ healthcareData, onHealthcareDataChange }: HealthcareFormProps) {
  const [activeTab, setActiveTab] = useState<'licenses' | 'certifications' | 'affiliations' | 'publications' | 'experience'>('licenses');

  // Medical Licenses
  const addMedicalLicense = () => {
    const newLicense: MedicalLicense = {
      type: '',
      number: '',
      state: '',
      expirationDate: '',
      status: 'active'
    };

    onHealthcareDataChange({
      ...healthcareData,
      medicalLicenses: [...(healthcareData.medicalLicenses || []), newLicense]
    });
  };

  const updateMedicalLicense = (index: number, updates: Partial<MedicalLicense>) => {
    const licenses = [...(healthcareData.medicalLicenses || [])];
    licenses[index] = { ...licenses[index], ...updates };
    onHealthcareDataChange({
      ...healthcareData,
      medicalLicenses: licenses
    });
  };

  const removeMedicalLicense = (index: number) => {
    const licenses = [...(healthcareData.medicalLicenses || [])];
    licenses.splice(index, 1);
    onHealthcareDataChange({
      ...healthcareData,
      medicalLicenses: licenses
    });
  };

  // Board Certifications
  const addBoardCertification = () => {
    const newCertification: BoardCertification = {
      board: '',
      specialty: '',
      certificationDate: '',
      status: 'active'
    };

    onHealthcareDataChange({
      ...healthcareData,
      boardCertifications: [...(healthcareData.boardCertifications || []), newCertification]
    });
  };

  const updateBoardCertification = (index: number, updates: Partial<BoardCertification>) => {
    const certifications = [...(healthcareData.boardCertifications || [])];
    certifications[index] = { ...certifications[index], ...updates };
    onHealthcareDataChange({
      ...healthcareData,
      boardCertifications: certifications
    });
  };

  const removeBoardCertification = (index: number) => {
    const certifications = [...(healthcareData.boardCertifications || [])];
    certifications.splice(index, 1);
    onHealthcareDataChange({
      ...healthcareData,
      boardCertifications: certifications
    });
  };

  // Hospital Affiliations
  const addHospitalAffiliation = () => {
    const newAffiliation: HospitalAffiliation = {
      hospital: '',
      role: '',
      privileges: [],
      startDate: '',
      current: true
    };

    onHealthcareDataChange({
      ...healthcareData,
      hospitalAffiliations: [...(healthcareData.hospitalAffiliations || []), newAffiliation]
    });
  };

  const updateHospitalAffiliation = (index: number, updates: Partial<HospitalAffiliation>) => {
    const affiliations = [...(healthcareData.hospitalAffiliations || [])];
    affiliations[index] = { ...affiliations[index], ...updates };
    onHealthcareDataChange({
      ...healthcareData,
      hospitalAffiliations: affiliations
    });
  };

  const removeHospitalAffiliation = (index: number) => {
    const affiliations = [...(healthcareData.hospitalAffiliations || [])];
    affiliations.splice(index, 1);
    onHealthcareDataChange({
      ...healthcareData,
      hospitalAffiliations: affiliations
    });
  };

  // Publications
  const addPublication = () => {
    const newPublication: Publication = {
      title: '',
      journal: '',
      authors: [],
      publicationDate: '',
      type: 'research'
    };

    onHealthcareDataChange({
      ...healthcareData,
      publications: [...(healthcareData.publications || []), newPublication]
    });
  };

  const updatePublication = (index: number, updates: Partial<Publication>) => {
    const publications = [...(healthcareData.publications || [])];
    publications[index] = { ...publications[index], ...updates };
    onHealthcareDataChange({
      ...healthcareData,
      publications: publications
    });
  };

  const removePublication = (index: number) => {
    const publications = [...(healthcareData.publications || [])];
    publications.splice(index, 1);
    onHealthcareDataChange({
      ...healthcareData,
      publications: publications
    });
  };

  // Clinical Experience
  const addClinicalExperience = () => {
    const newExperience: ClinicalExperience = {
      specialty: '',
      setting: '',
      yearsOfExperience: 0
    };

    onHealthcareDataChange({
      ...healthcareData,
      clinicalExperience: [...(healthcareData.clinicalExperience || []), newExperience]
    });
  };

  const updateClinicalExperience = (index: number, updates: Partial<ClinicalExperience>) => {
    const experiences = [...(healthcareData.clinicalExperience || [])];
    experiences[index] = { ...experiences[index], ...updates };
    onHealthcareDataChange({
      ...healthcareData,
      clinicalExperience: experiences
    });
  };

  const removeClinicalExperience = (index: number) => {
    const experiences = [...(healthcareData.clinicalExperience || [])];
    experiences.splice(index, 1);
    onHealthcareDataChange({
      ...healthcareData,
      clinicalExperience: experiences
    });
  };

  const tabs = [
    { id: 'licenses', name: 'Medical Licenses', icon: Award },
    { id: 'certifications', name: 'Board Certifications', icon: Award },
    { id: 'affiliations', name: 'Hospital Affiliations', icon: Building },
    { id: 'publications', name: 'Publications', icon: BookOpen },
    { id: 'experience', name: 'Clinical Experience', icon: Stethoscope },
  ];

  return (
    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
      <div className="flex items-center space-x-3 mb-6">
        <Stethoscope className="w-6 h-6 text-blue-400" />
        <h2 className="text-2xl font-semibold text-white">Healthcare Information</h2>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 mb-6">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.name}</span>
            </button>
          );
        })}
      </div>

      {/* Medical Licenses Tab */}
      {activeTab === 'licenses' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-white">Medical Licenses</h3>
            <button
              onClick={addMedicalLicense}
              className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg font-medium"
            >
              <Plus className="w-4 h-4" />
              <span>Add License</span>
            </button>
          </div>

          {(healthcareData.medicalLicenses || []).map((license, index) => (
            <div key={index} className="bg-white/10 border border-white/20 rounded-lg p-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white mb-2">License Type</label>
                  <select
                    value={license.type}
                    onChange={(e) => updateMedicalLicense(index, { type: e.target.value })}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
                  >
                    <option value="">Select License Type</option>
                    <option value="Medical License">Medical License</option>
                    <option value="DEA License">DEA License</option>
                    <option value="State Controlled Substance License">State Controlled Substance License</option>
                    <option value="NPI Number">NPI Number</option>
                  </select>
                </div>

                <div>
                  <label className="block text-white mb-2">License Number</label>
                  <input
                    type="text"
                    value={license.number}
                    onChange={(e) => updateMedicalLicense(index, { number: e.target.value })}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
                    placeholder="License number"
                  />
                </div>

                <div>
                  <label className="block text-white mb-2">State</label>
                  <input
                    type="text"
                    value={license.state}
                    onChange={(e) => updateMedicalLicense(index, { state: e.target.value })}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
                    placeholder="State"
                  />
                </div>

                <div>
                  <label className="block text-white mb-2">Expiration Date</label>
                  <input
                    type="date"
                    value={license.expirationDate}
                    onChange={(e) => updateMedicalLicense(index, { expirationDate: e.target.value })}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-white mb-2">Status</label>
                  <select
                    value={license.status}
                    onChange={(e) => updateMedicalLicense(index, { status: e.target.value as any })}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    onClick={() => removeMedicalLicense(index)}
                    className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg font-medium"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Board Certifications Tab */}
      {activeTab === 'certifications' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-white">Board Certifications</h3>
            <button
              onClick={addBoardCertification}
              className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg font-medium"
            >
              <Plus className="w-4 h-4" />
              <span>Add Certification</span>
            </button>
          </div>

          {(healthcareData.boardCertifications || []).map((cert, index) => (
            <div key={index} className="bg-white/10 border border-white/20 rounded-lg p-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white mb-2">Certifying Board</label>
                  <input
                    type="text"
                    value={cert.board}
                    onChange={(e) => updateBoardCertification(index, { board: e.target.value })}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
                    placeholder="e.g., American Board of Internal Medicine"
                  />
                </div>

                <div>
                  <label className="block text-white mb-2">Specialty</label>
                  <input
                    type="text"
                    value={cert.specialty}
                    onChange={(e) => updateBoardCertification(index, { specialty: e.target.value })}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
                    placeholder="e.g., Internal Medicine"
                  />
                </div>

                <div>
                  <label className="block text-white mb-2">Certification Date</label>
                  <input
                    type="date"
                    value={cert.certificationDate}
                    onChange={(e) => updateBoardCertification(index, { certificationDate: e.target.value })}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-white mb-2">Expiration Date (Optional)</label>
                  <input
                    type="date"
                    value={cert.expirationDate || ''}
                    onChange={(e) => updateBoardCertification(index, { expirationDate: e.target.value })}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-white mb-2">Status</label>
                  <select
                    value={cert.status}
                    onChange={(e) => updateBoardCertification(index, { status: e.target.value as any })}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
                  >
                    <option value="active">Active</option>
                    <option value="expired">Expired</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    onClick={() => removeBoardCertification(index)}
                    className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg font-medium"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Hospital Affiliations Tab */}
      {activeTab === 'affiliations' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-white">Hospital Affiliations</h3>
            <button
              onClick={addHospitalAffiliation}
              className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg font-medium"
            >
              <Plus className="w-4 h-4" />
              <span>Add Affiliation</span>
            </button>
          </div>

          {(healthcareData.hospitalAffiliations || []).map((affiliation, index) => (
            <div key={index} className="bg-white/10 border border-white/20 rounded-lg p-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white mb-2">Hospital/Institution</label>
                  <input
                    type="text"
                    value={affiliation.hospital}
                    onChange={(e) => updateHospitalAffiliation(index, { hospital: e.target.value })}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
                    placeholder="Hospital name"
                  />
                </div>

                <div>
                  <label className="block text-white mb-2">Department (Optional)</label>
                  <input
                    type="text"
                    value={affiliation.department || ''}
                    onChange={(e) => updateHospitalAffiliation(index, { department: e.target.value })}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
                    placeholder="Department"
                  />
                </div>

                <div>
                  <label className="block text-white mb-2">Role</label>
                  <input
                    type="text"
                    value={affiliation.role}
                    onChange={(e) => updateHospitalAffiliation(index, { role: e.target.value })}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
                    placeholder="e.g., Attending Physician, Staff Physician"
                  />
                </div>

                <div>
                  <label className="block text-white mb-2">Start Date</label>
                  <input
                    type="date"
                    value={affiliation.startDate}
                    onChange={(e) => updateHospitalAffiliation(index, { startDate: e.target.value })}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-white mb-2">Privileges</label>
                  <textarea
                    value={(affiliation.privileges || []).join('\n')}
                    onChange={(e) => updateHospitalAffiliation(index, { 
                      privileges: e.target.value.split('\n').filter(p => p.trim()) 
                    })}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
                    placeholder="Enter each privilege on a new line"
                    rows={3}
                  />
                </div>

                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-2 text-white">
                    <input
                      type="checkbox"
                      checked={affiliation.current}
                      onChange={(e) => updateHospitalAffiliation(index, { current: e.target.checked })}
                      className="w-4 h-4 text-blue-500 rounded"
                    />
                    <span>Current Affiliation</span>
                  </label>
                </div>

                <div className="flex items-end justify-end">
                  <button
                    onClick={() => removeHospitalAffiliation(index)}
                    className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg font-medium"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add other tabs (Publications, Clinical Experience) here... */}
    </div>
  );
} 