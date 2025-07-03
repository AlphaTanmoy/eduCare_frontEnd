import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ContactService, ContactFormData } from '../../../service/contact/contact.service';
import { loadBootstrap, removeBootstrap } from '../../../../load-bootstrap';
import { ResponseTypeColor } from '../../../constants/commonConstants';
import { MatDialog } from '@angular/material/dialog';
import { CustomAlertComponent } from '../../../common-component/custom-alert/custom-alert.component';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})

export class ContactComponent implements OnInit, OnDestroy {
  contactForm: FormGroup;
  isSubmitting = false;
  private bootstrapElements!: { css: HTMLLinkElement; js: HTMLScriptElement };

  constructor(
    private fb: FormBuilder,
    private contactService: ContactService,
    private dialog: MatDialog
  ) {
    this.contactForm = this.fb.group({
      emailId: ['', [Validators.required, Validators.email]],
      subject: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(200)]],
      message: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(2000)]]
    });
  }

  ngOnInit(): void {
    this.bootstrapElements = loadBootstrap();
  }

  ngOnDestroy(): void {
    removeBootstrap(this.bootstrapElements);
  }

  onSubmit(): void {
    if (this.contactForm.invalid || this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;
    const formData: ContactFormData = {
      emailId: this.contactForm.value.emailId,
      subject: this.contactForm.value.subject,
      message: this.contactForm.value.message
    };

    this.contactService.submitContactForm(formData).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        this.openDialog(
          'Message Sent',
          'Thank you for contacting us! We have received your message and will get back to you soon.',
          ResponseTypeColor.SUCCESS
        );
        this.contactForm.reset();
      },
      error: (error) => {
        console.error('Error submitting contact form:', error);
        this.isSubmitting = false;
        this.openDialog(
          'Error',
          'Failed to send your message. Please try again later.',
          ResponseTypeColor.ERROR
        );
      }
    });
  }

  private openDialog(title: string, text: string, type: number): void {
    this.dialog.open(CustomAlertComponent, {
      data: { title, text, type },
      width: '400px'
    });
  }
}
