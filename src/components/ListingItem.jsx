import { Link } from 'react-router-dom';
import { ReactComponent as DeleteIcon } from '../assets/svg/deleteIcon.svg';
import { ReactComponent as EditIcon } from '../assets/svg/editIcon.svg';
import bedIcon from '../assets/svg/bedIcon.svg';
import bathtubIcon from '../assets/svg/bathtubIcon.svg';

function ListingItem({ listing, id, onEdit, onDelete }) {
	const {
		discountedPrice,
		bathrooms,
		imgUrls,
		regularPrice,
		location,
		name,
		bedrooms,
		type,
		offer,
	} = listing;

	return (
		<li className='categoryListing'>
			<Link
				to={`/category/${listing.type}/${id}`}
				className='categoryListingLink'>
				<img src={imgUrls[0]} alt={name} className='categoryListingImg' />
				<div className='categoryListingDetails'>
					<p className='categoryListingLocation'>{location}</p>
					<p className='categoryListingName'>{name}</p>

					<p className='categoryListingPrice'>
						$
						{offer
							? discountedPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
							: regularPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
						{type === 'rent' && ' / Month'}
					</p>
					<div className='categoryListingInfoDiv'>
						<img src={bedIcon} alt='bed' />
						<p className='categoryListingInfoText'>
							{bedrooms > 1 ? `${bedrooms} Bedrooms` : '1 Bedroom'}
						</p>
						<img src={bathtubIcon} alt='bath' />
						<p className='categoryListingInfoText'>
							{bathrooms > 1 ? `${bathrooms} Bathrooms` : '1 Bathroom'}
						</p>
					</div>
				</div>
			</Link>

			{onDelete && (
				<DeleteIcon
					className='removeIcon'
					fill='rgb(231, 76,60)'
					onClick={() => onDelete(id, listing.name)}
				/>
			)}

			{onEdit && <EditIcon className='editIcon' onClick={() => onEdit(id)} />}
		</li>
	);
}

export default ListingItem;
