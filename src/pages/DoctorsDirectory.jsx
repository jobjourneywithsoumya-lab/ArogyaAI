import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { CalendarClock, Hospital, MapPin, Phone, Search, Stethoscope, Star, WalletCards } from 'lucide-react';
import { doctors, doctorsBySpecialization, specializations } from '../data/doctors';

const DoctorsDirectory = () => {
  const [selectedSpecialization, setSelectedSpecialization] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredDoctors = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    return doctors.filter(doctor => {
      const matchesSpecialization = selectedSpecialization === 'All' || doctor.specialization === selectedSpecialization;
      const matchesSearch = !term || [
        doctor.name,
        doctor.specialization,
        doctor.hospitalName,
        doctor.address,
        doctor.qualification
      ].some(value => value.toLowerCase().includes(term));

      return matchesSpecialization && matchesSearch;
    });
  }, [searchTerm, selectedSpecialization]);

  return (
    <div className="doctors-page min-height-screen">
      <section className="doctors-hero">
        <div className="container">
          <div className="doctors-hero-grid">
            <div>
              <div className="badge">
                <Stethoscope className="w-4 h-4" />
                Kalaburagi Doctor Network
              </div>
              <h1 className="section-title">Find Doctors by <span className="gradient-text">Specialization</span></h1>
              <p className="section-subtitle doctors-subtitle">
                Browse doctors from local hospitals, compare specialization, experience, fees, and available consultation slots.
              </p>
            </div>

            <div className="doctors-stats glass">
              <div>
                <strong>{doctors.length}</strong>
                <span>Doctors</span>
              </div>
              <div>
                <strong>{specializations.length}</strong>
                <span>Specializations</span>
              </div>
              <div>
                <strong>{new Set(doctors.map(doctor => doctor.hospitalName)).size}</strong>
                <span>Hospitals</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="doctors-content">
        <div className="container">
          <div className="doctor-toolbar glass">
            <div className="doctor-search">
              <Search className="w-5 h-5 text-primary" />
              <input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search doctor, hospital, qualification..."
              />
            </div>

            <select
              value={selectedSpecialization}
              onChange={(event) => setSelectedSpecialization(event.target.value)}
              className="doctor-select"
            >
              <option value="All">All specializations</option>
              {specializations.map(specialization => (
                <option key={specialization} value={specialization}>{specialization}</option>
              ))}
            </select>
          </div>

          <div className="specialization-strip">
            <button
              className={selectedSpecialization === 'All' ? 'active' : ''}
              onClick={() => setSelectedSpecialization('All')}
            >
              All <span>{doctors.length}</span>
            </button>
            {doctorsBySpecialization.map(group => (
              <button
                key={group.specialization}
                className={selectedSpecialization === group.specialization ? 'active' : ''}
                onClick={() => setSelectedSpecialization(group.specialization)}
              >
                {group.specialization} <span>{group.doctors.length}</span>
              </button>
            ))}
          </div>

          <div className="doctor-results-meta">
            Showing {filteredDoctors.length} doctor{filteredDoctors.length === 1 ? '' : 's'}
            {selectedSpecialization !== 'All' ? ` in ${selectedSpecialization}` : ''}
          </div>

          <div className="doctor-grid">
            {filteredDoctors.map((doctor, index) => (
              <motion.article
                key={doctor.doctorId}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: index * 0.03 }}
                className="doctor-card glass"
              >
                <div className="doctor-card-header">
                  <div>
                    <p className="doctor-specialization">{doctor.specialization}</p>
                    <h2>{doctor.name}</h2>
                    <p className="doctor-qualification">{doctor.qualification}</p>
                  </div>
                  <div className="doctor-rating">
                    <Star className="w-4 h-4" />
                    {doctor.rating}
                  </div>
                </div>

                <div className="doctor-info-list">
                  <p><Hospital className="w-4 h-4" /> {doctor.hospitalName}</p>
                  <p><MapPin className="w-4 h-4" /> {doctor.address} - {doctor.postalCode}</p>
                  <p><CalendarClock className="w-4 h-4" /> {doctor.experience} years experience</p>
                  <p><WalletCards className="w-4 h-4" /> Consultation fee: Rs. {doctor.consultationFee}</p>
                </div>

                <div className="slot-list">
                  {doctor.availableSlots.map(slot => (
                    <span key={slot}>{slot}</span>
                  ))}
                </div>

                <div className="doctor-actions">
                  <a className="btn btn-primary" href={`tel:${doctor.phone}`}>
                    <Phone className="w-4 h-4" /> Call Hospital
                  </a>
                  <a className="btn btn-outline" href={`mailto:${doctor.email}`}>
                    Book via Email
                  </a>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default DoctorsDirectory;
