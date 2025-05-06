import "./footer.css";

// Create a footer component for the main page, use tailwindcss to style: grid for responsiveness.
// Footer will have four sections that align horizontally on bigger screens and vertically on smaller screens.
function Footer() {
  return (
    <footer className="bg-teal-500 text-white py-8 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-center md:text-left">
        <div>
          <h4 className="text-lg font-semibold mb-2">About Us</h4>
          <p className="text-sm text-white/80">Learn more about our mission and values.</p>
        </div>
        <div>
          <h4 className="text-lg font-semibold mb-2">Services</h4>
          <p className="text-sm text-white/80">Discover what we offer to help you succeed.</p>
        </div>
        <div>
          <h4 className="text-lg font-semibold mb-2">Support</h4>
          <p className="text-sm text-white/80">Need help? Reach out to our support team.</p>
        </div>
        <div>
          <h4 className="text-lg font-semibold mb-2">Follow Us</h4>
          <p className="text-sm text-white/80">Stay connected through social media.</p>
        </div>
      </div>
    </footer>
  );
};

// Export the footer so it can be used in the App.tsx
export default Footer;
