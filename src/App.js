import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Explore from './pages/Explore';
import Offers from './pages/Offers';
import { Profile } from './pages/Profile';
import { SignIn } from './pages/SignIn';
import { SignUp } from './pages/SignUp';
import Navbar from './components/Navbar';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PrivateRoute from './components/PrivateRoute';
import FoggotPassword from './pages/FoggotPassword ';
import Category from './pages/Category';
import Listing from './pages/Listing';
import CreateListing from './pages/CreateListing';
import Contact from './pages/Contact';
import EditListing from './pages/EditListing';

function App() {
	return (
		<>
			<BrowserRouter>
				<Routes>
					<Route path='/' element={<Explore />} />
					<Route path='/offers' element={<Offers />} />
					<Route path='/category/:categoryName' element={<Category />} />

					<Route path='/profile' element={<PrivateRoute />}>
						<Route path='/profile' element={<Profile />} />
					</Route>

					<Route path='/sign-in' element={<SignIn />} />
					<Route path='/sign-up' element={<SignUp />} />
					<Route
						path='/category/:listingType/:listingId'
						element={<Listing />}
					/>
					<Route path='/create-listing' element={<CreateListing />} />
					<Route path='/contact/:landlordId' element={<Contact />} />
					<Route path='/edit-listing/:listingId' element={<EditListing />} />

					<Route path='/forgot-password' element={<FoggotPassword />} />
				</Routes>
				<Navbar />
			</BrowserRouter>
			<ToastContainer />
		</>
	);
}

export default App;
