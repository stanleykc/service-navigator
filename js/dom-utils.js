// Safe DOM manipulation utilities
// Replaces innerHTML usage to prevent XSS vulnerabilities

export class SafeDOM {
  // Safely create and populate a result card element
  static createResultCard(service) {
    const card = document.createElement('div');
    card.className = 'bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md hover:border-blue-400 cursor-pointer transition-all duration-200';
    card.dataset.serviceId = service.id;
    
    // Header section
    const header = document.createElement('div');
    header.className = 'flex justify-between items-start';
    
    const title = document.createElement('h3');
    title.className = 'font-bold text-lg text-gray-900';
    title.textContent = service.name;
    
    const distance = document.createElement('span');
    distance.className = 'text-sm font-semibold text-gray-600';
    distance.textContent = service.distance;
    
    header.appendChild(title);
    header.appendChild(distance);
    
    // Organization
    const org = document.createElement('p');
    org.className = 'text-sm text-gray-600 mb-2';
    org.textContent = service.organization;
    
    // Description
    const desc = document.createElement('p');
    desc.className = 'text-sm text-gray-700 mb-3';
    desc.textContent = service.description;
    
    // Footer section
    const footer = document.createElement('div');
    footer.className = 'flex items-center justify-between text-xs';
    
    const categoryBadge = document.createElement('span');
    categoryBadge.className = `px-2 py-1 rounded-full font-medium ${this.getCategoryColor(service.category)}`;
    categoryBadge.textContent = service.category;
    
    const sourceInfo = document.createElement('span');
    sourceInfo.className = 'text-gray-500';
    sourceInfo.textContent = 'Source: ';
    
    const sourceOrg = document.createElement('span');
    sourceOrg.className = 'font-semibold';
    sourceOrg.textContent = service.sourceOrg;
    
    sourceInfo.appendChild(sourceOrg);
    footer.appendChild(categoryBadge);
    footer.appendChild(sourceInfo);
    
    // Assemble card
    card.appendChild(header);
    card.appendChild(org);
    card.appendChild(desc);
    card.appendChild(footer);
    
    return card;
  }
  
  // Safely create modal content
  static createModalContent(service) {
    const container = document.createElement('div');
    container.className = 'space-y-6';
    
    // Organization section
    const orgSection = this.createSection('Organization', service.organization);
    container.appendChild(orgSection);
    
    // Location section
    const locationSection = this.createSection('Location', service.address);
    container.appendChild(locationSection);
    
    // Contact section
    const contactSection = document.createElement('div');
    const contactTitle = document.createElement('h4');
    contactTitle.className = 'font-semibold text-gray-800 mb-1';
    contactTitle.textContent = 'Contact Information';
    
    const contactDiv = document.createElement('div');
    contactDiv.className = 'text-gray-700 space-y-1';
    
    // Phone
    const phoneP = document.createElement('p');
    const phoneIcon = document.createElement('i');
    phoneIcon.setAttribute('data-lucide', 'phone');
    phoneIcon.className = 'inline-block h-4 w-4 mr-2';
    phoneP.appendChild(phoneIcon);
    phoneP.appendChild(document.createTextNode(service.contact.phone));
    
    // Email
    const emailP = document.createElement('p');
    const emailIcon = document.createElement('i');
    emailIcon.setAttribute('data-lucide', 'mail');
    emailIcon.className = 'inline-block h-4 w-4 mr-2';
    emailP.appendChild(emailIcon);
    emailP.appendChild(document.createTextNode(service.contact.email));
    
    // Website
    const websiteP = document.createElement('p');
    const websiteIcon = document.createElement('i');
    websiteIcon.setAttribute('data-lucide', 'globe');
    websiteIcon.className = 'inline-block h-4 w-4 mr-2';
    const websiteLink = document.createElement('a');
    websiteLink.href = '#';
    websiteLink.className = 'text-blue-600 hover:underline';
    websiteLink.textContent = service.contact.website;
    websiteP.appendChild(websiteIcon);
    websiteP.appendChild(websiteLink);
    
    contactDiv.appendChild(phoneP);
    contactDiv.appendChild(emailP);
    contactDiv.appendChild(websiteP);
    contactSection.appendChild(contactTitle);
    contactSection.appendChild(contactDiv);
    container.appendChild(contactSection);
    
    // Hours section
    const hoursSection = document.createElement('div');
    const hoursTitle = document.createElement('h4');
    hoursTitle.className = 'font-semibold text-gray-800 mb-2';
    hoursTitle.textContent = 'Hours of Operation';
    
    const hoursTable = document.createElement('table');
    hoursTable.className = 'w-full text-left text-sm text-gray-700';
    
    Object.entries(service.hours).forEach(([day, time]) => {
      const row = document.createElement('tr');
      const dayCell = document.createElement('td');
      dayCell.className = 'py-1 pr-4 font-medium';
      dayCell.textContent = day;
      
      const timeCell = document.createElement('td');
      timeCell.className = 'py-1';
      timeCell.textContent = time;
      
      row.appendChild(dayCell);
      row.appendChild(timeCell);
      hoursTable.appendChild(row);
    });
    
    hoursSection.appendChild(hoursTitle);
    hoursSection.appendChild(hoursTable);
    container.appendChild(hoursSection);
    
    // Eligibility section
    const eligibilitySection = this.createSection('Eligibility', service.eligibility);
    container.appendChild(eligibilitySection);
    
    // Application section
    const applicationSection = this.createSection('How to Apply', service.application);
    container.appendChild(applicationSection);
    
    // Source attribution
    const sourceSection = document.createElement('div');
    const sourceP = document.createElement('p');
    sourceP.className = 'text-xs text-center text-gray-500 pt-4 border-t mt-6';
    sourceP.textContent = `Data provided by ${service.sourceOrg}`;
    sourceSection.appendChild(sourceP);
    container.appendChild(sourceSection);
    
    return container;
  }
  
  // Helper method to create a simple text section
  static createSection(title, content) {
    const section = document.createElement('div');
    const titleEl = document.createElement('h4');
    titleEl.className = 'font-semibold text-gray-800 mb-1';
    titleEl.textContent = title;
    
    const contentEl = document.createElement('p');
    contentEl.className = 'text-gray-700';
    contentEl.textContent = content;
    
    section.appendChild(titleEl);
    section.appendChild(contentEl);
    return section;
  }
  
  // Get category-specific styling
  static getCategoryColor(category) {
    switch (category) {
      case 'Food':
        return 'bg-green-100 text-green-800';
      case 'Legal Aid':
        return 'bg-blue-100 text-blue-800';
      case 'Housing':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }
}