/**
 * HVAC Cost Guide - Main UX Interactions & Accessibility
 */

document.addEventListener("DOMContentLoaded", function () {
  // Mobile Navigation Toggle
  const mobileToggle = document.querySelector(".mobile-toggle");
  const mobileNav = document.querySelector(".nav-mobile");

  if (mobileToggle && mobileNav) {
    mobileToggle.addEventListener("click", function () {
      const isOpen = mobileNav.classList.toggle("open");
      mobileToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
  }

  // Accessible FAQ Accordions
  const faqItems = document.querySelectorAll(".faq-item");
  faqItems.forEach(function (item) {
    const trigger = item.querySelector(".faq-trigger");
    const content = item.querySelector(".faq-content");

    if (trigger && content) {
      trigger.addEventListener("click", function () {
        const isActive = item.classList.contains("active");

        // Close other items if in same accordion group
        const parent = item.closest(".faq-section");
        if (parent) {
          parent.querySelectorAll(".faq-item").forEach(function (sibling) {
            if (sibling !== item) {
              sibling.classList.remove("active");
              const sibTrigger = sibling.querySelector(".faq-trigger");
              if (sibTrigger) sibTrigger.setAttribute("aria-expanded", "false");
            }
          });
        }

        item.classList.toggle("active", !isActive);
        trigger.setAttribute("aria-expanded", !isActive ? "true" : "false");
      });
    }
  });

  // Smooth scroll for anchor jumps
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (targetId === "#") return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({ behavior: "smooth" });
      }
    });
  });
});
