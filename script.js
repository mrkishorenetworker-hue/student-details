const steps = document.querySelectorAll(".form-step");
const dots = document.querySelectorAll(".dot");
const progBar = document.getElementById("progBar");
let currentStep = 0;

function showStep(step) {
  steps.forEach((s, i) => {
    s.classList.toggle("active", i === step);
  });
  dots.forEach((d, i) => d.classList.toggle("active", i === step));
  progBar.style.width = (step / (steps.length - 1)) * 100 + "%";
}

function fillReview() {
  const formData = new FormData(document.getElementById("studentForm"));
  const reviewBox = document.getElementById("reviewBox");
  reviewBox.innerHTML = "";
  for (const [key, val] of formData.entries()) {
    if (val && key !== "consent") {
      reviewBox.innerHTML += `
        <div class="row">
          <strong>${key}</strong>
          <span>${val}</span>
        </div>`;
    }
  }
}

// Next & Prev
document.querySelectorAll(".next").forEach(btn =>
  btn.addEventListener("click", () => {
    if (currentStep < steps.length - 1) {
      currentStep++;
      showStep(currentStep);
      if (currentStep === steps.length - 1) fillReview();
    }
  })
);
document.querySelectorAll(".prev").forEach(btn =>
  btn.addEventListener("click", () => {
    if (currentStep > 0) {
      currentStep--;
      showStep(currentStep);
    }
  })
);

// Dots click
dots.forEach(dot =>
  dot.addEventListener("click", () => {
    currentStep = +dot.dataset.step;
    showStep(currentStep);
    if (currentStep === steps.length - 1) fillReview();
  })
);

// EmailJS init (replace with your keys)
(function() {
  emailjs.init("ShCQYHy1yIBu8aS5L");
})();

// Submit form
document.getElementById("studentForm").addEventListener("submit", function(e) {
  e.preventDefault();
  const form = this;

  emailjs.sendForm("service_118fge2", "template_we1g3o4", form)
    .then(() => {
      document.getElementById("resultMsg").textContent = "✅ Submitted successfully!";
      document.getElementById("downloadPDF").style.display = "inline-block";
      form.style.display = "none";
    }, (err) => {
      document.getElementById("resultMsg").textContent = "❌ Error: " + err.text;
    });
});

// PDF download
document.getElementById("downloadPDF").addEventListener("click", () => {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.text("Student Certificate", 14, 22);

  const formData = new FormData(document.getElementById("studentForm"));
  const data = [];
  formData.forEach((val, key) => {
    if (val && key !== "consent") data.push([key, val]);
  });

  doc.autoTable({
    startY: 30,
    head: [["Field", "Value"]],
    body: data,
  });

  doc.save("student_certificate.pdf");
});

showStep(currentStep);
