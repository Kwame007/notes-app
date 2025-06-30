import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Note } from '../../utilities/note.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-note-card',
  templateUrl: './notes-card.component.html',
  styleUrls: ['./notes-card.component.scss'],
  imports: [CommonModule, FormsModule],
})
export class NoteCardComponent {
  @Input() note!: Note;
  @Input() isSelected: boolean = false;
  @Input() isArchived: boolean = false;
  @Input() searchQuery: string = '';

  @Output() select = new EventEmitter<void>();
  @Output() delete = new EventEmitter<void>();
  @Output() archive = new EventEmitter<void>();

  formatDate(date: Date | string | undefined): string {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date || Date.now()));
  }

  highlightText(text: string): string {
    if (!this.searchQuery.trim()) {
      return text;
    }

    const regex = new RegExp(`(${this.searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return text.replace(regex, '<mark class="search-highlight">$1</mark>');
  }

  onCardClick() {
    this.select.emit();
  }

  onDeleteClick(event: Event) {
    event.stopPropagation();
    this.delete.emit();
  }

  onArchiveClick(event: Event) {
    event.stopPropagation();
    this.archive.emit();
  }

  get safeTags() {
    return this.note && this.note.tags ? this.note.tags : [];
  }
}
