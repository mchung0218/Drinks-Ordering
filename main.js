$(function (){
	//cache 
	var $orders = $('#orders'),
		$name = $('#name'),
		$drink = $('#drink');

	//mustache template
	var orderTemplate = $('#order-template').html();

	function addOrder(order){
		$orders.append(Mustache.render(orderTemplate, order));
	}

	//GET order at start
	$.ajax({
		type: 'GET',
		url: 'http://rest.learncode.academy/api/mchung/friends',
  		success: function(orders) {
    		$.each(orders, function(i, order){
    			addOrder(order);
    		});
  		},
  		error: function() {
  			alert('error loading orders');
  		}
	});

	//Post order after submit
	$('#add-order').on('click', function(){
		var order = {
			name: $name.val(),
			drink: $drink.val(),
		};

		$.ajax({
			type: 'POST',
			url:'http://rest.learncode.academy/api/mchung/friends',
			data: order,
			success: function(newOrder) {
				addOrder(newOrder);
			},
			error: function(){
				alert('error saving order');
			}
		});

	});

	//Use delegate to avoid hoisting error 
	//Remove Items
		$orders.delegate('.remove', 'click', function(){

			var $li = $(this).closest('li');

			$.ajax({
				type: 'DELETE',
				url: 'http://rest.learncode.academy/api/mchung/friends/' + $(this).attr('data-id'),
				success: function (){
		    		$li.fadeOut(500, function() {
		    			$(this).remove();
		    		});
		    	}
	  		});
		});

	//Edit Existing Items
		//Edit buttom to display edit field
		$orders.delegate('.editOrder', 'click', function(){
			var $li = $(this).closest('li');
			$li.find('input.name').val( $li.find('span.name').html() );
			$li.find('input.drink').val( $li.find('span.drink').html() );
			$li.addClass('edit');
		})
		//Cancel button to get out of edit mode
		$orders.delegate('.cancelEdit', 'click', function(){
			$(this).closest('li').removeClass('edit');
		});
		//Save button to PUT new items to Json
		$orders.delegate('.saveEdit', 'click', function(){
			var $li = $(this).closest('li');
			var order = {
				name: $li.find('input.name').val(),
				drink: $li.find('input.drink').val(),
			};

			$.ajax({
				type: 'PUT',
				url:'http://rest.learncode.academy/api/mchung/friends/' + $li.attr('data-id'),
				data: order,
				success: function(newOrder) {
					$li.find('span.name').html(order.name);
					$li.find('span.drink').html(order.drink);
					$li.removeClass('edit');
				},
				error: function(){
					alert('error updating order');
				}
			});

		});



});


