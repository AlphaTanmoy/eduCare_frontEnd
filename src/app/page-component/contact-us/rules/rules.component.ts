import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { loadBootstrap, removeBootstrap } from '../../../../load-bootstrap';

@Component({
  selector: 'app-rules',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rules.component.html',
  styleUrls: ['./rules.component.css']
})
export class RulesComponent implements OnInit, OnDestroy {
  private bootstrapElements!: { css: HTMLLinkElement; js: HTMLScriptElement };

  // Student related data
  studentRequirements = [
    'To take admission, students need to submit a xerox copy of their Aadhaar Card / Voter Card / Driving License and Last Qualification Proof.',
    'Need to submit an Aadhaar card xerox copy of parent. (Optional for elder)',
    'Required to submit Minimum Two copy passport size. (Large size not be accepted)',
    'Required to Carry Original Document.',
    'Admission Fees are different for every course.',
    'After few days of admission, if any students leave for any reason then admission fees will not be refunded.',
    'Students will be allowed for Final Certificate Exam after passing some class exams.',
    'Class will be as per time schedule.',
    'After completing one course student needs to take a new admission for their new course.'
  ];

  // Center registration requirements with HTML for email link
  centerRequirements = [
    'To register your center Download the registration Form and fill with your details. Then send it to pdf format in <a href="mailto:govt.reg@educarecenter.in" class="text-primary fw-bold">govt.reg@educarecenter.in</a>',
    'To register your center you must submit your Aadhaar Card, Pan Card, Voter Card.',
    'Submit your Last Qualification Result with Certificate. (Minimum H.S. Pass)',
    'Need to submit Experience Certificate. (Ex- Computer Certificate, Drawing Certificate, Dance Certificate, Yoga etc.)',
    'Registration Fees are different for various Categories.',
    'Basic Required: Specific Room (min-120 sqft), 1 Table, Min 5 Chairs, Attendance Copy, Light and Fan, Toilet Room.'
  ];

  // Terms and conditions
  termsAndConditions = [
    'Education Carefully Institute shall issue authorization to run above-mentioned zone/s courses, for above mentioned single location/address of my/our center & the same authorization shall not be applicable to my/our franchise/ branch at different locations.',
    'I/We will not issue any certificate in the name of Education Carefully Institute nor will I get any registration issued by any other institution/ Company/ Brand/ Govt./ NGO/ Society.',
    'I/We shall remain liable for every due towards Education Carefully Institute in every circumstance.',
    'Education Carefully Institute has no sharing in student Admission fee/ tuition fee/ exam fee & all said fees will be prescribed/ decided by me/ our center.',
    'Education Carefully Institute shall not invest/has not invested in my center/Institute set up.',
    'I/we shall get student/s training certificate via post at my/our center/postal center/ postal address.',
    'All types of payments paid, to be paid to Education Carefully Institute, shall not be refundable in any case.',
    'Education Carefully Institute shall not be liable for any commitment or any advertisement or tie-up with students, govt., corporate, universities, public & other organizations.',
    'If I/We are found involved in any criminal, financial, social or any other offence then the authorization of my/our center shall automatically come to an end.',
    'The authorization of my/our center/Institute/NGO shall be valid from applied & the same shall be renewed in the month of March every year.',
    'Education Carefully Institute shall have full right to update/modify/change/add any rules & regulations.'
  ];

  // Grading system
  gradingSystem = [
    { range: '85% – 100%', grade: 'A+', remarks: 'Excellent' },
    { range: '75% – 84%', grade: 'A', remarks: 'Very Good' },
    { range: '60% – 74%', grade: 'B', remarks: 'Good' },
    { range: '40% – 59%', grade: 'C', remarks: 'Satisfactory' },
    { range: 'Below 40%', grade: 'F', remarks: 'Failure' }
  ];

  // Contact information
  contactInfo = {
    address: 'Education Carefully Institute Thakdari, New Town, Bidhannagar, North 24 Parganas, West Bengal, 700102',
    phones: ['+91 9831744911', '+91 8420922761'],
    email: 'info@educarecenter.in',
    registrationEmail: 'govt.reg@educarecenter.in'
  };

  ngOnInit(): void {
    this.bootstrapElements = loadBootstrap();
  }

  ngOnDestroy(): void {
    removeBootstrap(this.bootstrapElements);
  }
}
